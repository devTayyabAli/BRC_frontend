import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useContext } from "react";
import { useSettings } from "src/@core/hooks/useSettings.js";
import {
  registerUser,
  completeSignup,
  resetSignupState,
} from "src/store/apps/auth/signupSlice";
import { completeRegister } from "src/store/apps/transaction/completeTransactionEvents";
import { styled, useTheme } from "@mui/material/styles";
import { CHECK_USERNAME_OR_EMAIL } from "src/api/apiEndPoint";
import Link from "next/link";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";
import InputAdornment from "@mui/material/InputAdornment";
import CustomTextField from "src/@core/components/mui/text-field";

// ** socket Imports
import SocketContext from "src/context/Socket";

// ** WEB3 Imports
import { useWeb3Modal } from "@web3modal/wagmi/react";
import {
  useAccount,
  useContractWrite,
  useDisconnect,
  useWaitForTransaction,
} from "wagmi";
import { ethers } from "ethers";
import { CONTRACT_INFO } from "src/contract";
import { useSwitchNetwork } from "wagmi";
import useValidateAccount from "src/hooks/useValidateAccount";
// ** Icon Imports
import Icon from "src/@core/components/icon";
import BlankLayout from "src/@core/layouts/BlankLayout";
import FooterIllustrationsV2 from "src/views/pages/auth/FooterIllustrationsV2";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/router";
import api from "src/api/api";
import { ENV } from "src/configs/env";
import { GET_REFERRAL_DETAIL_ENDPOINT } from "src/api/apiEndPoint";
import { toast } from "react-hot-toast";

// redux
import { useSelector } from "react-redux";
import { useContractRegister } from "src/hooks/useContractRegister";
import useGetRegisterUSDCTokens from "src/hooks/useGetRegisterUSDCTokens";
import { createTxLog } from "src/store/apps/transaction/transactionLogsSlice";
import { deletePendingUser } from "src/store/apps/auth/signupSlice";
// MUI Imports
import { Select, MenuItem, FormControl } from "@mui/material";

// Other imports
import { countryCodesList } from "src/constants/conuntryCodeList";
import isMobile from "is-mobile";
const RegisterIllustration = styled("video")(({ theme }) => ({
  // zIndex: 2,
  // maxHeight: 600,
  // marginTop: theme.spacing(12),
  // marginBottom: theme.spacing(12),
  width: "100%",
  height: "100%",
  objectFit: "cover",
  borderRadius: "1rem",
  [theme.breakpoints.down(1540)]: {
    maxHeight: 550,
  },
  [theme.breakpoints.down("lg")]: {
    maxHeight: 500,
  },
}));

const RightWrapper = styled(Box)(({ theme }) => ({
  width: "100%",
  [theme.breakpoints.up("md")]: {
    maxWidth: 450,
  },
  [theme.breakpoints.up("lg")]: {
    maxWidth: 600,
  },
  [theme.breakpoints.up("xl")]: {
    maxWidth: 750,
  },
}));

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: "none",
  color: `${theme.palette.primary.main} !important`,
}));

const validationSchema = Yup.object().shape({
  referredBy: Yup.string()
    .required("Referral ID is required")
    .test(
      "no-leading-or-trailing-space",
      "Referral ID should not contain spaces",
      (value) => {
        return (
          !value ||
          !(value.startsWith(" ") || value.endsWith(" ") || /\s/.test(value))
        );
      }
    ),
  name: Yup.string()
    .matches(/^[^\s].*$/, "Full Name should not start with a space")
    .max(64, "Full Name should not exceed 64 characters")
    .required("Full Name is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  // phoneNumber: Yup.string()
  //   .required("Phone number is required")
  //   .matches(
  //     /^((\+[\d]{1,4}[ \-]*)|(\([0-9]{2,3}\)[ \-]*)|([0-9]{2,4})[ \-]*)*?[0-9]{3,4}?[ \-]*[0-9]{3,4}?$/,
  //     "Phone number is not valid"
  //   ),
  userName: Yup.string()
    .required("Login User ID is required")
    .max(64, "Login User ID should not exceed 64 characters")
    .test(
      "no-leading-or-trailing-space",
      "Login User ID should not contain spaces",
      (value) => {
        return (
          !value ||
          !(value.startsWith(" ") || value.endsWith(" ") || /\s/.test(value))
        );
      }
    ),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/,
      "Password must include at least one capital letter, one digit, and one special character"
    )
    .required("Password is required"),
  confirmPassword: Yup.string()
    .required("Confirm Password is required")
    .oneOf([Yup.ref("password"), null], "Passwords do not match"),
  walletAddress: Yup.string(),
});

const Register = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const router = useRouter();
  const hidden = useMediaQuery(theme.breakpoints.down("md"));
  const { settings } = useSettings();
  const [countryCode, setCountryCode] = useState("+92");

  const handleChangeCountryCode = (event) => {
    setCountryCode(event.target.value);
  };

  //redux
  const { user } = useSelector((state) => state.signup);
  //sockets
  const socket = useContext(SocketContext);

  //** web3
  const { open } = useWeb3Modal();
  const { address } = useAccount();
  const { chain } = useValidateAccount();
  const { disconnect } = useDisconnect()
  const { switchNetwork } = useSwitchNetwork({
    onSuccess(data) {
      signup(formik.values);
    },
  });
  // ** Vars
  const { skin } = settings;
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [referralDetails, setReferralDetails] = useState(null);
  const [loader, setLoader] = useState(null);
  const [email, setEmail] = useState("");
  const [termsChecked, setTermsChecked] = useState(false);

  // const imageSource =
  //   skin === "bordered"
  //     ? "auth-v2-register-illustration-bordered"
  //     : "auth-v2-register-illustration";

  const imageSource =
    skin === "bordered"
      ? "auth-v2-register-illustration-bordered"
      : settings.mode === "dark"
        ? "Logo-signup"
        : "Logo-signup";

  const videoSource = "signup";

  const fetchReferralDetails = async (referralId) => {
    try {
      const response = await api.get(
        `${GET_REFERRAL_DETAIL_ENDPOINT}/${referralId}`
      );
      setReferralDetails(response?.data?.data);
    } catch (error) {
      setReferralDetails(null);
    }
  };

  const handleReferralIdChange = async (event) => {
    const referralId = event.target.value;
    if (referralId.trim() !== "") {
      await fetchReferralDetails(referralId);
    } else {
      setReferralDetails(null);
    }
  };

  const checkUserNameOrEmail = async (param, event) => {
    try {
      const value = event.target.value;
      let url = `${CHECK_USERNAME_OR_EMAIL}/`;
      if (param === "userName" && value) {
        // Include email in the URL if it's available
        if (!email) {
          // Show error if email is not present
          toast.error("Please enter Email Address first", {
            duration: 5000,
          });
          formik.setFieldValue("userName", "");
          formik.setFieldTouched("userName", false);
          return;
        }
        url += `?userName=${value}&email=${email}`; // Include email in the URL
      } else if (param === "email" && value) {
        url += `?email=${value}`;
        setEmail(value); // Update email state when email is entered
      }
      await api.get(`${url}`);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error(`${error.response.data.message}`, {
          duration: 5000,
        });
      }
    }
  };
  //send approval transaction
  const {
    isError: isApprovalError,
    data: approveTokenTx,
    error: approveTokenTxError,
    isLoading: isApprovingTokens,
    isSuccess: isApprovalTxSent,
    write: approveTokens,
  } = useContractWrite({
    address: CONTRACT_INFO.token.address,
    abi: CONTRACT_INFO.token.abi,
    functionName: "approve",
  });

  //wait for approval tx
  const {
    isSuccess: isApprovalCompleted,
    isError: approveWaitError,
    error: approveTxWaitError,
  } = useWaitForTransaction({
    hash: approveTokenTx?.hash,
  });

  //send transfer token tx
  const {
    isError: tokenError,
    error: transferTokenTxError,
    data: tokenTx,
    isLoading: isTransferInprogress,
    isSuccess: isTokenTxSent,
    write: transferTokens,
  } = useContractWrite({
    address: CONTRACT_INFO.main.address,
    abi: CONTRACT_INFO.main.abi,
    functionName: "registerUser",
  });

  useEffect(() => {
    if (isApprovalCompleted) {
      const delay = 3000;
      const timerId = setTimeout(() => {
        transferTokens({
          args: [ethers.utils.parseEther("5"), referralDetails?.walletAddress],
          from: address,
        });
      }, delay);

      // Clear the timeout if the component unmounts or if isSuccess changes
      return () => clearTimeout(timerId);
    }
  }, [isApprovalCompleted]);

  useEffect(() => {
    if (isTokenTxSent) {
      dispatch(
        completeSignup({
          userId: user?._id,
          txHash: tokenTx?.hash,
        })
      );
    }
  }, [isTokenTxSent]);

  useEffect(() => {
    return () => {
      dispatch(resetSignupState());
    };
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window?.localStorage?.removeItem("userOTPEmail");
    }
  }, []);

  const registerUserFromBackend = async (data) => {
    window.localStorage.setItem("userOTPEmail", data?.email);
    const payload = data;
    // payload.phoneNumber = countryCode + data.phoneNumber;
    const foundPendingUser = localStorage.getItem("pendingUser");
    let flag = false;
    if (foundPendingUser) {
      const pendingDeleteUserRes = await handleDeletePendingUser();
      if (pendingDeleteUserRes) {
        localStorage.removeItem("pendingUser");
        flag = true;
      }
    } else {
      flag = true;
    }
    if (!flag) {
      return toast.error("Registration failed, Please try again!", {
        duration: 5000,
      });
    }

    const response = await dispatch(
      registerUser({
        ...payload,
        referredBy: referralDetails ? referralDetails?._id : "",
      })
    );
    if (response?.payload?.data?._id) {
      localStorage.setItem("pendingUser", response?.payload?.data?._id);

    }

    if (response?.meta?.requestStatus !== "fulfilled") {
      setLoader(null);
      return;
    }
    approveTokens({
      args: [CONTRACT_INFO.main.address, ethers.utils.parseEther("5")],
      from: address,
    });
  };

  //wait for transfer token tx

  const {
    isSuccess: tokenTransferedCompleted,
    isError: tokenWaitError,
    error: tokenTxWaitError,
  } = useWaitForTransaction({
    hash: tokenTx?.hash,
  });

  //getUSDCTokensBalance
  const { availableUSDC, isUSDCBlncFetched } =
    useGetRegisterUSDCTokens(address);
  useEffect(() => {
    handleError();
  }, [isApprovalError, tokenError, approveWaitError, tokenWaitError]);
  const handleError = async () => {
    if (isApprovalError || tokenError || approveWaitError || tokenWaitError) {
      const error =
        approveTokenTxError || transferTokenTxError || approveTxWaitError || tokenTxWaitError;
      setLoader(false);
      const pendingDeleteUserRes = await handleDeletePendingUser();
      if (pendingDeleteUserRes) {
        localStorage.removeItem("pendingUser");
      }
      dispatch(
        createTxLog({
          walletAddress: address,
          ...(tokenTx?.hash && { txHash: tokenTx?.hash }),
          error: JSON.stringify(error?.message),
        })
      );

      toast.error(error?.message, {
        duration: 5000,
      });
    }
  };
  const handleDeletePendingUser = async () => {
    const foundPendingUser = localStorage.getItem("pendingUser");
    if (foundPendingUser) {
      const pendingDeleteUserRes = await dispatch(deletePendingUser(foundPendingUser));
      if (pendingDeleteUserRes?.meta?.requestStatus === "fulfilled") {
        localStorage.removeItem("pendingUser");
        return true
      }
    }
  };

  useEffect(() => {
    if (tokenTransferedCompleted) {
      dispatch(completeRegister(tokenTx?.hash));
      setLoader(false);
    }
  }, [tokenTransferedCompleted]);
  const formik = useFormik({
    initialValues: {
      name: "",
      userName: "",
      role: "user",
      password: "",
      confirmPassword: "",
      email: "",
      walletAddress: address,
      referredBy: "",
      phoneNumber: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      if (chain.id !== ENV.chainId) {
        return switchNetwork?.(ENV.chainId);
      }
      signup(values);
    },
  });
  const signup = (values) => {
    if (!address) {
      toast.error("Wallet Address is required to Register!", {
        duration: 5000,
      });
      return;
    }
    if (!termsChecked) {
      toast.error(
        "Please accept the Terms & Services and our Privacy Policy!",
        {
          duration: 5000,
        }
      );
      return;
    }
    registerUserFromBackend({ ...values, walletAddress: address });
    setLoader(true);
  };
  useEffect(() => {
    if (socket && user?._id) {
      socket?.emit("join", `${user?._id}`);
      socket?.on("Register", ({ }) => {
        toast.success("Registration successful!", {
          duration: 5000,
        });
        router.push("/verify/account/");
      });
    }
    return () => {
      socket.emit("leave", `${user?._id}`);
      socket.off("Register");
    };
  }, [socket, user?._id]);

  useEffect(() => {
    const referralIdParam = router.query.referral_id;
    if (referralIdParam) {
      formik?.setValues({
        ...formik.values,
        referredBy: referralIdParam,
      });
      if (referralIdParam?.trim() !== "") {
        fetchReferralDetails(referralIdParam);
      }
    }
  }, [router?.query?.referral_id]);
  useEffect(() => {
    handleDeletePendingUser();
    return () => {
      handleDeletePendingUser();
    };
  }, []);

  const backgroundImageUrl = "BG-new-kgc";
   useEffect(() => {
      const excludedPaths = ["/set-password/[token]", "/login", "/signup"];
      if (router && !excludedPaths.includes(router.pathname)) {
        if (isMobile() && !window?.ethereum) {
          router.push("/wallet-connection-error-guest");
        }
      }
    }, []);
  return (
    <Box className="content-right" sx={{ backgroundColor: "background.paper" }}>
      {!hidden ? (
        <Box
          sx={{
            flex: 1,
            display: "flex",
            position: "relative",
            alignItems: "center",
            borderRadius: "20px",
            justifyContent: "center",
            // backgroundColor: "customColors.bodyBg",
            backgroundImage: `url(/images/pages/${backgroundImageUrl}.jpg)`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundSize: "cover",
            margin: (theme) => theme.spacing(8, 0, 8, 8),
          }}
        >
          <RegisterIllustration
            alt="register-illustration"
            src={`/images/pages/${videoSource}.mp4`}
            autoPlay
            loop
          />
          <FooterIllustrationsV2 />
        </Box>
      ) : null}
      <RightWrapper>
        <Box
          sx={{
            p: [6, 12],
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box sx={{ width: "100%", maxWidth: 400 }}>
            <Box sx={{ my: 6 }}>
              <Typography variant="h3" sx={{ mb: 1.5 }}>
                World's Largest Crypto Earning Platform!
              </Typography>
              <Typography variant="h5" sx={{ mb: 1.5 }}>
                Sign Up
              </Typography>
            </Box>
            <form noValidate autoComplete="off" onSubmit={formik.handleSubmit}>
              <CustomTextField
                fullWidth
                label="Referral ID*"
                sx={{ mb: 4 }}
                placeholder="Referral ID"
                {...formik.getFieldProps("referredBy")}
                onBlur={async (e) => {
                  await formik.handleBlur(e);
                  if (!formik.errors.referredBy) {
                    await handleReferralIdChange(e);
                  }
                }}
                error={
                  formik.touched.referredBy && Boolean(formik.errors.referredBy)
                }
                helperText={
                  formik.touched.referredBy && formik.errors.referredBy
                }
              />
              <CustomTextField
                fullWidth
                label="Referral Name"
                sx={{ mb: 4 }}
                placeholder="Referral Name"
                disabled={true}
                value={referralDetails ? referralDetails?.name : ""}
              />
              <CustomTextField
                fullWidth
                label="Full Name*"
                sx={{ mb: 4 }}
                placeholder="Full Name"
                {...formik.getFieldProps("name")}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />
              <CustomTextField
                fullWidth
                label="Email Address*"
                sx={{ mb: 4 }}
                placeholder="Email Address"
                {...formik.getFieldProps("email")}
                onBlur={(e) => checkUserNameOrEmail("email", e)}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
              {/* <CustomTextField
                fullWidth
                label="Phone Number*"
                id="auth-login-v2-password"
                type="string"
                sx={{ mb: 4 }}
                placeholder="Phone Number"
                {...formik.getFieldProps("phoneNumber")}
                error={
                  formik.touched.phoneNumber &&
                  Boolean(formik.errors.phoneNumber)
                }
                helperText={
                  formik.touched.phoneNumber && formik.errors.phoneNumber
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FormControl size="small" variant="standard" fullWidth>
                        <Select
                          style={{
                            borderWidth: "0px",
                            width: "75px",
                            paddingLeft: 0,
                          }}
                          size="small"
                          value={countryCode}
                          onChange={handleChangeCountryCode}
                          displayEmpty
                          renderValue={() => countryCode}
                        >
                          {countryCodesList?.map((country) => (
                            <MenuItem key={country?.code} value={country?.code}>
                              {country?.code} ({country?.name})
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </InputAdornment>
                  ),
                }}
              /> */}
              <CustomTextField
                fullWidth
                label="Login User ID*"
                sx={{ mb: 4 }}
                placeholder="Login User ID"
                {...formik.getFieldProps("userName")}
                onBlur={async (e) => {
                  await formik.handleBlur(e);
                  if (!formik.errors.userName) {
                    await checkUserNameOrEmail("userName", e);
                  }
                }}
                error={
                  formik.touched.userName && Boolean(formik.errors.userName)
                }
                helperText={formik.touched.userName && formik.errors.userName}
              />
              <CustomTextField
                fullWidth
                label="Password*"
                id="auth-login-v2-password"
                type={showPassword ? "text" : "password"}
                sx={{ mb: 4 }}
                placeholder="Password"
                {...formik.getFieldProps("password")}
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                helperText={formik.touched.password && formik.errors.password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <Icon
                          fontSize="1.25rem"
                          icon={showPassword ? "tabler:eye" : "tabler:eye-off"}
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <CustomTextField
                fullWidth
                label="Confirm Password*"
                id="auth-login-v2-confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                sx={{ mb: 4 }}
                placeholder="Confirm Password"
                {...formik.getFieldProps("confirmPassword")}
                error={
                  formik.touched.confirmPassword &&
                  Boolean(formik.errors.confirmPassword)
                }
                helperText={
                  formik.touched.confirmPassword &&
                  formik.errors.confirmPassword
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        <Icon
                          fontSize="1.25rem"
                          icon={
                            showConfirmPassword
                              ? "tabler:eye"
                              : "tabler:eye-off"
                          }
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              {address ?
                <>
                  <CustomTextField
                    fullWidth
                    label="BSC Smart Chain Wallet Address *"
                    {...formik.getFieldProps("walletAddress")}
                    error={
                      formik.touched.walletAddress &&
                      Boolean(formik.errors.walletAddress)
                    }
                    sx={{ mb: 4 }}
                    disabled={true}
                    value={address?.slice(0, 10) + "..." + address?.slice(-10)}
                    helperText={
                      formik.touched.walletAddress && formik.errors.walletAddress
                    }
                  />
                  <Button
                    fullWidth
                    type="button"
                    variant="contained"
                    sx={{ mb: 4 }}
                    onClick={() => disconnect()}
                  >
                    Disconnect Wallet
                  </Button>
                </>
                : (
                  <>
                    <Button
                      onClick={() => open({ view: "Networks" })}
                      fullWidth
                      type="button"
                      variant="contained"
                      sx={{ mb: 4 }}
                    >
                      Connect Wallet
                    </Button>
                  </>
                )}

              <FormControlLabel
                control={
                  <Checkbox
                    checked={termsChecked}
                    onChange={(e) => setTermsChecked(e.target.checked)}
                  />
                }
                sx={{
                  mb: 4,
                  mt: 1.5,
                  "& .MuiFormControlLabel-label": {
                    fontSize: theme.typography.body2.fontSize,
                  },
                }}
                label={
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      flexWrap: "wrap",
                      justifyContent: "center",
                    }}
                  >
                    <Typography
                      component={LinkStyled}
                      href="/terms-and-services"
                      sx={{ ml: 1 }}
                    >
                      Terms & Services
                    </Typography>
                    <Typography sx={{ mx: 1.5, color: "text.secondary" }}>
                      and our
                    </Typography>
                    <Typography
                      component={LinkStyled}
                      href="/privacy-policy"
                      sx={{}}
                    >
                      Privacy Policy
                    </Typography>
                  </Box>
                }
              />
              <Button
                fullWidth
                type="submit"
                disabled={
                  !formik?.isValid ||
                  !termsChecked ||
                  (Number(availableUSDC) === 0 && isUSDCBlncFetched) ||
                  loader
                }
                variant="contained"
                sx={{ mb: 4 }}
              >
                {loader ? "loading" : "Register"}
              </Button>
              {Number(availableUSDC) === 0 && isUSDCBlncFetched && (
                <p
                  style={{
                    color: "#EA5455",
                    fontSize: "0.81rem",
                    textAlign: "center",
                  }}
                >
                  Insufficient USDT Tokens!
                </p>
              )}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                <Typography sx={{ color: "text.secondary", mr: 2 }}>
                  Already have an account?
                </Typography>
                <Typography component={LinkStyled} href="/login">
                  Sign in instead
                </Typography>
              </Box>
            </form>
          </Box>
        </Box>
      </RightWrapper>
    </Box>
  );
};

Register.getLayout = (page) => <BlankLayout>{page}</BlankLayout>;
Register.guestGuard = true;

export default Register;
