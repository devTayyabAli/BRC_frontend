import { styled, useTheme } from "@mui/material/styles";
import { useSettings } from "src/@core/hooks/useSettings";
import { Typography, Box } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import BlankLayout from "src/@core/layouts/BlankLayout";
import FooterIllustrationsV2 from "src/views/pages/auth/FooterIllustrationsV2";

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

const PrivacyPolicy = () => {
  const theme = useTheme();
  const { settings } = useSettings();
  const hidden = useMediaQuery(theme.breakpoints.down("md"));
  const { spacing } = theme;
  const { skin } = settings;

  const imageSource =
    skin === "bordered"
      ? "auth-v2-login-illustration-bordered"
      : settings.mode === "dark"
      ? "Logo-signup"
      : "Logo-signup";

  const backgroundImageUrl = "BG-new-kgc";

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
                    {`Privacy Policy`}
                  </Typography>
                </Box>
                <ul>
                <li>
                  <Typography variant="body1">
                  <b>Voluntary Information:</b> Your personal data, like Identity and Contact Data, is provided voluntarily.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                  <b>Data Collection:</b> We collect data directly from interactions and through automated technologies.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                  <b>Data Use and Sharing:</b> Your data is used for services and marketing, and shared with third parties in specific cases.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                  <b>Security and Retention:</b> Measures are taken to protect and retain data as needed for its purpose.
                  </Typography>
                </li>
              </ul>
            </Box>
            </Box>
    </RightWrapper>
    </Box>
  );
};

PrivacyPolicy.getLayout = (page) => <BlankLayout>{page}</BlankLayout>;
PrivacyPolicy.guestGuard = true;

export default PrivacyPolicy;