// ** MUI Imports
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";

// ** Custom Component Import
import CustomTextField from "src/@core/components/mui/text-field";
import { useContractRegister } from "src/hooks/useContractRegister";
import { useAccount } from "wagmi";
import { useSelector } from "react-redux";
import { ENV } from "src/configs/env";
import { formatNumber, toFixedDecimal } from "src/constants/common";
import { useSettings } from "src/@core/hooks/useSettings";
const AvailableStake = () => {
  const { settings, saveSettings } = useSettings()
  const { address } = useAccount();
  const user = useSelector((state) => state?.getCurrentUser?.user?.data);
  const { tokenBlnc: availableKGC } = useContractRegister(address);
  const openNewUrl = (URL) => {
    return window.open(URL, "_blank");
  };
  return (
    <Card sx={{ p: 10 }}>
      <Card sx={{ border: 1 }}>
        <Box sx={{ mt: 4, ml: 5 }}></Box>
        <form onSubmit={(e) => e.preventDefault()}>
          <CardContent>
            <Box>
            <Box>
              <Typography
                variant="span"
                sx={{ mt: 4, color: "", fontSize: 24, fontWeight: 600 }}
              >
                Total Stake (BRC)
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box sx={{ mr: 4 }}>
                  <img src="/images/favicon.ico" width="32" height="32" alt="brc-logo" />
                  {/* <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32">
                  <g fill="none">
                    <circle cx="16" cy="16" r="16" fill="#F3BA2F" />
                    <path
                      fill="#FFF"
                      d="M12.116 14.404L16 10.52l3.886 3.886 2.26-2.26L16 6l-6.144 6.144 2.26 2.26zM6 16l2.26-2.26L10.52 16l-2.26 2.26L6 16zm6.116 1.596L16 21.48l3.886-3.886 2.26 2.259L16 26l-6.144-6.144-.003-.003 2.263-2.257zM21.48 16l2.26-2.26L26 16l-2.26 2.26L21.48 16zm-3.188-.002h.002v.002L16 18.294l-2.291-2.29-.004-.004.004-.003.401-.402.195-.195L16 13.706l2.293 2.293z"
                    />
                  </g>
                </svg> */}
                </Box>
                <Box>
                  <Typography
                    variant="span"
                    sx={{
                      mt: 1,
                      mb: 0,
                      color: "",
                      fontWeight: 600,
                      fontSize: 20,
                    }}
                  >
                    {user?.totalStakeAmount || 0}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box>
            <Typography
              variant="span"
              sx={{ mt: 6, color: "", fontSize: 24, fontWeight: 600 }}
            >
              BRC Balance
            </Typography>
            <Box sx={{ display: "flex", mt: 2, alignItems: "center" }}>
              <Box sx={{ mr: 4 }}>
                <img src="/images/favicon.ico" width="32" height="32" alt="brc-logo" />
                {/* <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32">
                  <g fill="none">
                    <circle cx="16" cy="16" r="16" fill="#F3BA2F" />
                    <path
                      fill="#FFF"
                      d="M12.116 14.404L16 10.52l3.886 3.886 2.26-2.26L16 6l-6.144 6.144 2.26 2.26zM6 16l2.26-2.26L10.52 16l-2.26 2.26L6 16zm6.116 1.596L16 21.48l3.886-3.886 2.26 2.259L16 26l-6.144-6.144-.003-.003 2.263-2.257zM21.48 16l2.26-2.26L26 16l-2.26 2.26L21.48 16zm-3.188-.002h.002v.002L16 18.294l-2.291-2.29-.004-.004.004-.003.401-.402.195-.195L16 13.706l2.293 2.293z"
                    />
                  </g>
                </svg> */}
              </Box>
              <Box sx={{ display: "flex", alignItems: "baseline" }}>
                <Typography
                  variant="h4"
                  sx={{
                    mt: 1,
                    mb: 0,
                    color: "",
                    fontWeight: 600,
                    fontSize: 20,
                  }}
                >
                  {formatNumber(availableKGC, toFixedDecimal) || 0}
                </Typography>
              </Box>
            </Box>

            </Box>

            </Box>
          </CardContent>
          <Box sx={{ px: 5 }}>
            <Button
              fullWidth
              type="submit"
              sx={{
                mr: 2,
                mb: 4,
                py: 3,
                background: settings?.mode == "dark" ? 'linear-gradient(135deg, transparent 20%, rgba(255, 215, 0, 0.2) 50%)' : 'linear-gradient(135deg, rgba(16, 16, 16, 0.8) 20%, #ea5455 50%)',
                border: "1px solid #fff",
                borderRadius: "20px",

                "&:hover": {
                  backgroundColor: "#1d439e",
                },
              }}
              variant="contained"
              onClick={() => openNewUrl(ENV.bscScanUrl)}
            >
              BSC Scan
            </Button>
            {/* <Button
              fullWidth
              type="submit"
              sx={{
                mr: 2,
                mb: 4,
                py: 3,
                borderColor: "#fff",
                background: '#DAA520',
              borderRadius:"20px",

                color: "#fff",
                "&:hover": {
                  borderColor: "#fff",
                  backgroundColor: "#DAA520",
                  color: "#fff",
                },
              }}
              variant="outlined"
              onClick={() => openNewUrl(ENV.panCakeSwapUrl)}
            >
              Buy / Sell
            </Button> */}

          
          </Box>
        </form>
      </Card>
    </Card>
  );
};

export default AvailableStake;
