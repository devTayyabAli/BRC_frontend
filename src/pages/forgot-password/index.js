// ** Next Import
import Link from "next/link";

// ** MUI Components
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";
import { styled, useTheme } from "@mui/material/styles";

// ** Custom Component Import
import CustomTextField from "src/@core/components/mui/text-field";

// ** Icon Imports
import Icon from "src/@core/components/icon";

// ** Layout Import
import BlankLayout from "src/@core/layouts/BlankLayout";

// ** Demo Imports
import FooterIllustrationsV2 from "src/views/pages/auth/FooterIllustrationsV2";
import { useDispatch } from "react-redux";
import { forgetPasswordUser } from "src/store/apps/auth/forgetPasswordSlice";
import { toast } from "react-hot-toast";
import * as yup from "yup";
import { useFormik } from "formik";
import { useSettings } from "src/@core/hooks/useSettings";

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
});

// Styled Components
const ForgotIllustration = styled("img")(({ theme }) => ({
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

const LinkStyled = styled(Link)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  textDecoration: "none",
  justifyContent: "center",
  color: theme.palette.primary.main,
  fontSize: theme.typography.body1.fontSize,
}));

const ForgotPassword = () => {
  // Redux useDispatch hook
  const dispatch = useDispatch();
  // ** Hooks
  const theme = useTheme();
  const { spacing } = theme;
  const { settings } = useSettings();
  const { skin } = settings;
  const backgroundImageUrl = "BG-new-kgc";
  const imageSource =
  skin === "bordered"
    ? "auth-v2-login-illustration-bordered"
    : settings.mode === "dark"
    ? "Logo-signup"
    : "Logo-signup";

  // ** Vars
  const hidden = useMediaQuery(theme.breakpoints.down("md"));
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await dispatch(
          forgetPasswordUser({ email: values.email })
        );
        if (response?.meta?.requestStatus === "fulfilled") {
          const { message, status } = response.payload;
          if (status === 200) {
            toast.success(`${message}`, {
              duration: 5000,
            });
            localStorage?.setItem('set-password', values?.email);
          }
        } else {
          toast.error("User does not exist!", {
            duration: 5000,
          });
        }
      } catch (error) {
        console.error("User does not exist:", error);
      }
    },
  });

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
           <ForgotIllustration
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
          <Box sx={{ width: "100%", maxWidth: 400 }}>
            <Box sx={{ my: 6 }}>
              <Typography
                sx={{
                  mb: 1.5,
                  fontWeight: 500,
                  fontSize: "1.625rem",
                  lineHeight: 1.385,
                }}
              >
                Forgot Password? 🔒
              </Typography>
              <Typography sx={{ color: "text.secondary" }}>
                Enter your email and we&prime;ll send you instructions to reset
                your password
              </Typography>
            </Box>
            <form noValidate autoComplete="off" onSubmit={formik.handleSubmit}>
              <CustomTextField
                fullWidth
                label="Email Address"
                sx={{ mb: 4 }}
                placeholder="Email Address"
                {...formik.getFieldProps("email")}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
              <Button
                fullWidth
                type="submit"
                variant="contained"
                sx={{ mb: 4 }}
              >
                Send Reset Link
              </Button>
              <Typography
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  "& svg": { mr: 1 },
                }}
              >
                <LinkStyled href="/login">
                  <Icon fontSize="1.25rem" icon="tabler:chevron-left" />
                  <span>Back to Login</span>
                </LinkStyled>
              </Typography>
            </form>
          </Box>
        </Box>
      </RightWrapper>
    </Box>
  );
};
ForgotPassword.getLayout = (page) => <BlankLayout>{page}</BlankLayout>;
ForgotPassword.guestGuard = true;

export default ForgotPassword;
