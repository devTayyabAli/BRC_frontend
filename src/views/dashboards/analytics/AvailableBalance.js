// ** MUI Imports
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Button from "@mui/material/Button";
import CardContent from "@mui/material/CardContent";
import { useTheme } from "@mui/material/styles";
import useGetUSDCTokens from "src/hooks/useGetUSDCTokens";
// ** Next Import
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { useSettings } from "src/@core/hooks/useSettings";
import { Typography } from "@mui/material";

const AvailableBalance = () => {
  // ** Hook
  const theme = useTheme();
  const router = useRouter();
  const { settings, saveSettings } = useSettings()

  const referralStatsData = useSelector(
    (state) => state?.levelBonus?.referralStats
  );
  const {
    tokenBlnc: availableBonusBalance,
  } = useGetUSDCTokens(referralStatsData?.availableBonusBalance || 0);
  const openNewUrl = (URL) => {
    return window.open(URL, "_blank");
  };
  return (
    <Card>
      <CardHeader sx={{ pb: 0 }} title="Available Bonus Balance" />

      <CardContent>
        <Box sx={{ color: "", fontSize: 26, fontWeight: 700 }}>${availableBonusBalance}</Box>
        <Box
          sx={{
            mt: 6,
            p: theme.spacing(4, 5),
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Button
            fullWidth
            type="submit"
            sx={{
              mr: 2,
              mb: 4,
              py: 4,
              background: '#DAA520',
              border: "1px solid #fff",
              borderRadius:"20px",

              "&:hover": {
                backgroundColor: "#DAA520",
              },
            }}
            variant="contained"
            onClick={() => router.push("/withdrawal")}
          >
            Withdraw
          </Button>
          {/* <Button
            fullWidth
            type="submit"
            sx={{
              mr: 2,
              mb: 4,
              py: 4,
              background: settings?.mode == "dark" ? 'linear-gradient(135deg, rgba(255, 215, 0, 0.2) 20%, transparent 50%)' : 'linear-gradient(135deg, #ea5455 20%, rgba(16, 16, 16, 0.8) 50%)',
              border: "1px solid #fff",
              borderRadius:"20px",


              "&:hover": {
                backgroundColor: "#1d439e",
              },
            }}
            variant="contained"
            onClick={() => router.push("/fund-transfer")}
          >

            Fund Transfer to BRC FX Trading Account

          </Button> */}
          <Button
            fullWidth
            type="submit"
            sx={{
              mr: 2,
              mb: 4,
              py: 4,
              background: settings?.mode == "dark" ? 'linear-gradient(135deg, transparent 20%, rgba(255, 215, 0, 0.2) 50%)' : 'linear-gradient(135deg, rgba(16, 16, 16, 0.8) 20%, #ea5455 50%)',
              border: "1px solid #fff",
              borderRadius:"20px",

              "&:hover": {
                backgroundColor: "#1d439e",
              },
            }}
            variant="contained"
            onClick={() => router.push("/stake")}
          >
            Buy Package
          </Button>
            <Button
              fullWidth
              type="submit"
              sx={{
                mr: 2,
                mb: 4,
                py: 3,
                background: settings?.mode == "dark" ? 'linear-gradient(135deg, rgba(255, 215, 0, 0.2) 20%, transparent 50%)' : 'linear-gradient(135deg, #ea5455 20%, rgba(16, 16, 16, 0.8) 50%)',
                border: "1px solid #fff",
                borderRadius: "20px",

                "&:hover": {
                  backgroundColor: "#1d439e",
                },
              }}
              variant="contained"
              onClick={() =>
                openNewUrl(`${ENV.etherScanUrl}/${ENV.kgcAddress}`)
              }
            >
              BRC Token
            </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AvailableBalance;