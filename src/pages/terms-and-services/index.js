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

const TermsAndServices = () => {
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
                    {`Terms and Services`}
                  </Typography>
                </Box>
                <ul>
                <li>
                  <Typography variant="body1">
                    Minimum Withdrawal 10%
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                    Deduction 5% On Every Withdrawal
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                    Deposit and Withdrawal Available In BRC Token Only
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                    24 x 7 Withdrawal Available 
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                    Staking Capping 2X
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                    Capping 5X (inc all income)
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                    Retopup Required After Capping
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                    P2P Available with 1% Deduction
                  </Typography>
                </li>
              </ul>
            </Box>
            </Box>
    </RightWrapper>
    </Box>
  );
};

TermsAndServices.getLayout = (page) => <BlankLayout>{page}</BlankLayout>;
TermsAndServices.guestGuard = true;

export default TermsAndServices;