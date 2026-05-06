import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { styled, useTheme } from "@mui/material/styles";
import { useDispatch } from "react-redux";
import { loginUser, resetUser } from "src/store/apps/auth/loginSlice";
import { useSettings } from "src/@core/hooks/useSettings";
import toast from "react-hot-toast";
import defaultAuthConfig from "src/configs/auth";
import Link from "next/link";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";

import InputAdornment from "@mui/material/InputAdornment";

// ** WEB3 Imports
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount, useDisconnect } from "wagmi";
import { useSwitchNetwork } from "wagmi";
import useValidateAccount from "src/hooks/useValidateAccount";

// ** Custom Component Import
import CustomTextField from "src/@core/components/mui/text-field";
import Icon from "src/@core/components/icon";
import themeConfig from "src/configs/themeConfig";

import BlankLayout from "src/@core/layouts/BlankLayout";
import FooterIllustrationsV2 from "src/views/pages/auth/FooterIllustrationsV2";
import { Formik, Field, Form } from "formik";
import * as yup from "yup";
import { ENV } from "src/configs/env";
import { keyframes } from "@emotion/react";
import isMobile from "is-mobile";
import { resetCurrentUser } from "src/store/apps/auth/currentUserSlice";
const bounce2 = keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-40px);
  }
  60% {
    transform: translateY(-20px);
  }
`;

const LoginIllustration = styled("img")(({ theme }) => ({
  zIndex: 2,
  maxHeight: 450,
  marginTop: theme.spacing(12),
  // animation: `${bounce2} 3s ease infinite`,
  marginBottom: theme.spacing(12),
  [theme.breakpoints.down(1540)]: {
    maxHeight: 550,
  },
  [theme.breakpoints.down("lg")]: {
    maxHeight: 500,
  },
}));

const commonBoxStyles = {
  width: "100%",
  maxWidth: 450,
  "@media (min-width: 1280px)": {
    maxWidth: 600,
  },
  "@media (min-width: 1920px)": {
    maxWidth: 750,
  },
};

const RightWrapper = styled(Box)(({ theme }) => ({
  ...commonBoxStyles,
}));

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: "none",
  color: `${theme.palette.primary.main} !important`,
}));

const schema = yup.object().shape({
  userId: yup.string().required("Login User ID is required"),
  password: yup.string().required("Password is required"),
  address: yup.string(),
});

const LoginPage = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const router = useRouter();
  const [loader, setLoader] = useState(null);
  const [payload, setPayload] = useState(null);
  const [showWalletError, setShowWalletError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { settings } = useSettings();

  const hidden = useMediaQuery(theme.breakpoints.down("md"));
  const { spacing } = theme;
  const { skin } = settings;

  //** web3
  const { open } = useWeb3Modal();
  const { address: walletAddress } = useAccount();
  const { chain } = useValidateAccount();
  const { disconnect } = useDisconnect()
  const { switchNetwork } = useSwitchNetwork({
    onSuccess(data) {
      login(payload);
    },
  });

  const initialValues = {
    userId: "",
    password: "",
    address: walletAddress,
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      window?.localStorage?.removeItem("userOTPEmail");
    }
    dispatch(resetUser());
    dispatch(resetCurrentUser());
  }, []);

  const onSubmit = async (values) => {
    setPayload(values);
    if (chain.id !== ENV.chainId) {
      return switchNetwork?.(ENV.chainId);
    }
    login(values);
  };

  const login = async (values) => {
    setLoader(true);
    const { userId, password, address } = values;
    if (!walletAddress) {
      return setShowWalletError(true);
    } else {
      setShowWalletError(false);
    }
    try {
      const response = await dispatch(loginUser({ userName: userId, password, walletAddress }));
      if (response?.meta?.requestStatus === "fulfilled") {
        const { data } = response.payload;
        const { storageTokenKeyName, storageUserDataKeyName } = defaultAuthConfig;
        window.localStorage.setItem(storageTokenKeyName, data?.token);
        window.localStorage.setItem(storageUserDataKeyName, JSON.stringify(response?.payload));
        router?.push("/dashboards/analytics").then(() => {
          setLoader(false);
        });
      } else {
        setLoader(false);
      }
    } catch (error) {
      console.error("Authentication failed:", error);
    }
  };

  const imageSource =
    skin === "bordered"
      ? "auth-v2-login-illustration-bordered"
      : settings.mode === "dark"
        ? "Logo-signup"
        : "Logo-signup";

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
    <Formik initialValues={initialValues} validationSchema={schema} onSubmit={onSubmit}>
      <Form>
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
                margin: () => spacing(8, 0, 8, 8),
              }}
            >
              <LoginIllustration
                alt="login-illustration"
                src={`/images/pages/${imageSource}.png`}
              />
              <FooterIllustrationsV2 />
            </Box>
          ) : null}
          <RightWrapper>
            <Box
              sx={{
                p: [spacing(6), spacing(12)],
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box sx={{ width: "100%", maxWidth: 400 }}>
                <Box sx={{ my: spacing(6) }}>
                  <Typography variant="h3" sx={{ mb: spacing(1.5) }}>
                    {`Welcome to ${themeConfig.templateName}! 👋🏻`}
                  </Typography>
                  <Typography sx={{ color: "text.secondary" }}>
                    World's Largest Crypto Earning Platform!
                  </Typography>
                  <Typography variant="h2" sx={{ mt: spacing(1.5) }}>
                    Sign In
                  </Typography>
                  <Typography sx={{ color: "text.secondary" }}>
                    Signin to Continue in our BRC Platform
                  </Typography>
                </Box>

                <Box sx={{ mb: spacing(4) }}>
                  <Field name="userId">
                    {({ field, meta }) => (
                      <CustomTextField
                        fullWidth
                        label="Login User ID*"
                        {...field}
                        placeholder="Login User ID"
                        error={Boolean(meta.touched && meta.error)}
                        helperText={meta.touched && meta.error ? meta.error : ""}
                      />
                    )}
                  </Field>
                </Box>
                <Box sx={{ mb: spacing(4) }}>
                  <Field name="password">
                    {({ field, meta }) => (
                      <CustomTextField
                        fullWidth
                        {...field}
                        label="Login Password*"
                        id="auth-login-v2-password"
                        placeholder="Enter Password"
                        error={Boolean(meta.touched && meta.error)}
                        helperText={meta.touched && meta.error ? meta.error : ""}
                        type={showPassword ? "text" : "password"}
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
                    )}
                  </Field>
                </Box>
                {walletAddress ? <>
                  <Box sx={{ mb: spacing(4) }}>
                    <Field name="address">
                      {({ field, meta }) => (
                        <CustomTextField
                          fullWidth
                          {...field}
                          label="Wallet Address*"
                          id="auth-login-v2-address"
                          value={walletAddress?.slice(0, 10) + "..." + walletAddress?.slice(-10)}
                          error={Boolean(meta.touched && meta.error)}
                          helperText={meta.touched && meta.error ? meta.error : ""}
                          type={"text"}
                        />
                      )}
                    </Field>

                  </Box>
                  <Button
                      fullWidth
                      type="button"
                      variant="contained"
                      sx={{ mb: spacing(4) }}
                      onClick={() => disconnect()}
                    >
                      Disconnect Wallet
                    </Button>
                </>
                 : (
                  <>
                    <Button
                      fullWidth
                      type="button"
                      variant="contained"
                      sx={{ mb: spacing(4) }}
                      onClick={() => open({ view: "Networks" })}
                    >
                      Connect Wallet
                    </Button>
                  </>
                )}
                <Box
                  sx={{
                    mb: spacing(1.75),
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    justifyContent: "space-between",
                    float: "right",
                  }}
                >
                  <Typography component={LinkStyled} href="/forgot-password">
                    Forgot Password?
                  </Typography>
                </Box>
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  sx={{ mb: spacing(4) }}
                  disabled={loader ? true : false}
                >
                  {loader ? "loading" : "Login"}
                </Button>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                    justifyContent: "center",
                  }}
                >
                  <Typography sx={{ color: "text.secondary", mr: spacing(2) }}>
                    New on our platform?
                  </Typography>
                  <Typography href="/signup" component={LinkStyled}>
                    Sign up
                  </Typography>
                </Box>
              </Box>
            </Box>
          </RightWrapper>
        </Box>
      </Form>
    </Formik>
  );
};

LoginPage.getLayout = (page) => <BlankLayout>{page}</BlankLayout>;
LoginPage.guestGuard = true;

export default LoginPage;
