import { useState } from "react";
import { useRouter } from "next/router";
import { styled, useTheme } from "@mui/material/styles";
// Redux imports
import { useDispatch } from "react-redux";
import { setUser } from "src/store/apps/auth/loginSlice";
import { getVerifyEmailOTP, getVerifyPhoneNumberOTP } from "src/store/apps/auth/getAccountVerifyEmailOTPSlice";
import { verifyEmailOTP, verifyPhoneNumberOTP } from "src/store/apps/auth/verifyAccountEmailOTPSlice";
import { useSettings } from "src/@core/hooks/useSettings";
import defaultAuthConfig from "src/configs/auth";
import toast from "react-hot-toast";
import Link from "next/link";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";
// ** Custom Component Import
import CustomTextField from "src/@core/components/mui/text-field";

import BlankLayout from "src/@core/layouts/BlankLayout";
import FooterIllustrationsV2 from "src/views/pages/auth/FooterIllustrationsV2";
import { Formik, Field, Form } from "formik";
import * as yup from "yup";

const LoginIllustration = styled("img")(({ theme }) => ({
  zIndex: 2,
  maxHeight: 450,
  marginTop: theme.spacing(12),
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
  accountVerificationCode: yup
  .mixed()
  .test(
    'no-spaces',
    'Account verification code must not contain spaces.',
    value => !/\s/.test(value)
  )
  .test(
    'is-number',
    'Account verification code must be a number.',
    value => !isNaN(value)
  )
  .test(
    'exact-length',
    'Account verification code must be exactly 6 characters.',
    value => {
      const stringValue = String(value)?.replace(/\D/g, '');
      return stringValue?.length === 6;
    }
  ),
});

const VerifyOtp = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const router = useRouter();
  const [loader, setLoader] = useState(null);
  const { settings } = useSettings();

  const hidden = useMediaQuery(theme.breakpoints.down("md"));
  const { spacing } = theme;
  const { skin } = settings;

  const initialValues = {
    accountVerificationCode: "",
  };

  const handleResendOTP = async () => {
    const userOTPEmail = localStorage.getItem("userOTPEmail");

    try {
      const response = await dispatch(getVerifyPhoneNumberOTP({ email: userOTPEmail }));
      if (response?.meta?.requestStatus === "fulfilled") {
        toast.success("Verification code has been sent to your phone number.", {
          duration: 5000,
        });
      } else {
        toast.error("Something went wrong!", {
          duration: 5000,
        });
      }
    } catch (error) {
      console.error("[RESEND_OTP_ERROR]", error);
    }
  };

  const onSubmit = async (values) => {
    setLoader(true);
    const { accountVerificationCode } = values;
    const userOTPEmail = localStorage.getItem("userOTPEmail");

    try {
      const response = await dispatch(
        verifyPhoneNumberOTP({ email: userOTPEmail, otp: accountVerificationCode })
      );
      if (response?.meta?.requestStatus === "fulfilled") {
        const { storageTokenKeyName, storageUserDataKeyName } = defaultAuthConfig;
        window.localStorage.setItem(storageTokenKeyName, response?.payload?.data?.token);
        window.localStorage.setItem(storageUserDataKeyName, JSON.stringify(response?.payload));
        dispatch(setUser(response?.payload));
        router?.push("/dashboards/analytics").then(() => {
          setLoader(false);
          window.localStorage.removeItem("userOTPEmail");
          toast.success("Account verified successfully.", {
            duration: 5000,
          });
        });
      } else {
        setLoader(false);
      }
    } catch (error) {
      console.error("[ACCOUNT_VERIFICATION_ERROR]", error);
    }
  };

  const imageSource =
    skin === "bordered"
      ? "auth-v2-login-illustration-bordered"
      : settings.mode === "dark"
      ? "Logo-signup"
      : "Logo-signup";

  const backgroundImageUrl = "BG-new-kgc";

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
                  <Typography variant="h2" sx={{ mt: spacing(1.5) }}>
                    Verify your account
                  </Typography>
                  <Typography sx={{ color: "text.secondary" }}>
                    We have sent a verification code on your phone number.
                  </Typography>
                </Box>

                <Box sx={{ mb: spacing(4) }}>
                  <Field name="accountVerificationCode">
                    {({ field, meta }) => (
                      <CustomTextField
                        fullWidth
                        autoFocus
                        {...field}
                        label="Verification code*"
                        id="auth-login-v2-password"
                        error={Boolean(meta.touched && meta.error)}
                        helperText={meta.touched && meta.error ? meta.error : ""}
                        type={"string"}
                      />
                    )}
                  </Field>
                </Box>

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
                  <Typography component={LinkStyled} href="#" onClick={handleResendOTP}>
                    Resend the verification code?
                  </Typography>
                </Box>
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  sx={{ mb: spacing(4) }}
                  disabled={loader ? true : false}
                >
                  {loader ? "loading" : "Submit"}
                </Button>
              </Box>
            </Box>
          </RightWrapper>
        </Box>
      </Form>
    </Formik>
  );
};

VerifyOtp.getLayout = (page) => <BlankLayout>{page}</BlankLayout>;
VerifyOtp.guestGuard = true;

export default VerifyOtp;