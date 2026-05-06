import CustomTextField from "src/@core/components/mui/text-field";
import BlankLayout from "src/@core/layouts/BlankLayout";
import FooterIllustrationsV2 from "src/views/pages/auth/FooterIllustrationsV2";
import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import useMediaQuery from "@mui/material/useMediaQuery";
import * as yup from "yup";
import { styled, useTheme } from "@mui/material/styles";
import { toast } from "react-hot-toast";
import { Box, Button, IconButton, InputAdornment } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";
import { resetPasswordUser } from "src/store/apps/auth/resetPasswordSlice";
import { useRouter } from "next/router";
import Icon from "src/@core/components/icon";
import { useSettings } from "src/@core/hooks/useSettings";

const defaultValues = {
  password: "",
  confirmPassword: "",
};

const schema = yup.object().shape({
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/,
      "Password must include at least one capital letter, one digit, and one special character"
    )
    .required("New Password is required"),
  confirmPassword: yup
    .string()
    .oneOf(
      [yup.ref("password"), null],
      "Confirm password must match with new password"
    )
    .required("Confirm Password is required"),
});

const SetPasswordIllustration = styled("img")(({ theme }) => ({
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

const ResetPassword = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const theme = useTheme();
  const hidden = useMediaQuery(theme.breakpoints.down("md"));
  const { spacing } = theme;
  const { settings } = useSettings();
  const { skin } = settings;
  const [resetToken, setResetToken] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const backgroundImageUrl = "BG-new-kgc";
  const imageSource =
  skin === "bordered"
    ? "auth-v2-login-illustration-bordered"
    : settings.mode === "dark"
    ? "Logo-signup"
    : "Logo-signup";

  useEffect(() => {
    const { token } = router.query;
    if (token) {
      setResetToken(token);
    }
  }, [router.query]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const email = localStorage?.getItem("set-password");
      const { password } = data;
      const response = await dispatch(
        resetPasswordUser({
          email,
          password,
          resetToken,
          requestType: "accountVerification",
        })
      );
      if (response?.meta?.requestStatus === "fulfilled") {
        const { message } = response.payload;
        toast.success(`${message}`, {
          duration: 5000,
        });
        // Navigate to the login page
        router?.push("/login");
        return;
      }
      toast.error(`${"Unable to Reset, Please try again!"}`, {
        duration: 5000,
      });
    } catch (error) {
      console.error("Something went wrong:", error);
    }
  };

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
        margin: () => spacing(8, 0, 8, 8),
      }}
    >
      <SetPasswordIllustration
        alt="login-illustration"
        src={`/images/pages/${imageSource}.png`}
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
          <Box sx={{ width: "100%", maxWidth: 600 }}>
              <Box>
                <Grid container spacing={6} sx={{ py: 4 }}>
                  <Grid item xs={12} md={6} lg={3} mt={2} sx={{ whiteSpace: 'nowrap' }}>
                    New Password
                  </Grid>
                  <Grid item xs={12} md={6} lg={9}>
                    <Controller
                      name="password"
                      control={control}
                      rules={{}}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          fullWidth
                          value={value}
                          label=""
                          onChange={onChange}
                          placeholder="New Password"
                          error={Boolean(errors.password)}
                          aria-describedby="validation-schema-first-name"
                          {...(errors.password && {
                            helperText: errors.password.message,
                          })}
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
                                    icon={
                                      showPassword
                                        ? "tabler:eye"
                                        : "tabler:eye-off"
                                    }
                                  />
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      )}
                    />
                    <Box sx={{ color: "#f16d75", fontSize: 13, pt: 4 }}>
                      Important note : Keep your account password safe & secure,
                      do not share with any one.
                      <Box sx={{ color: "#f16d75", fontSize: 13 }}>
                        Strong Password like this BRC@token.0x9#
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
                <Grid container spacing={6} sx={{ py: 4 }}>
                  <Grid item xs={12} md={6} lg={3} mt={2} sx={{ whiteSpace: 'nowrap' }}>
                    Confirm Password
                  </Grid>
                  <Grid item xs={12} md={6} lg={9}>
                    <Controller
                      name="confirmPassword"
                      control={control}
                      rules={{}}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          fullWidth
                          value={value}
                          label=""
                          onChange={onChange}
                          placeholder="Confirm Password"
                          error={Boolean(errors.confirmPassword)}
                          aria-describedby="validation-schema-confirm-password"
                          {...(errors.confirmPassword && {
                            helperText: errors.confirmPassword.message,
                          })}
                          type={showConfirmPassword ? "text" : "password"}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  edge="end"
                                  onMouseDown={(e) => e.preventDefault()}
                                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                      )}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={6} sx={{ py: 4 }}>
                  <Grid item xs={12} md={6} lg={3}></Grid>
                  <Grid item xs={12} md={6} lg={9}>
                    <Button
                      fullWidth
                      onClick={handleSubmit(onSubmit)}
                      sx={{
                        mr: 2,
                        mb: 4,
                        py: 4,
                        background: "#214fbe",
                        "&:hover": {
                          backgroundColor: "#1d439e",
                        },
                      }}
                      variant="contained"
                    >
                      Reset Password
                    </Button>
                  </Grid>
                </Grid>
              </Box>
          </Box>
        </Box>
      </RightWrapper>
    </Box>
  );
};
ResetPassword.getLayout = (page) => <BlankLayout>{page}</BlankLayout>;
ResetPassword.guestGuard = true;

export default ResetPassword;