// ** MUI Imports
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import useGetUSDCTokens from "src/hooks/useGetUSDCTokens";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { kgcToUSDC } from "src/constants/common";

const DownlineTeam = () => {
  const { tokenBlnc: oneUSDC } = useGetUSDCTokens(1);
  const [referralStats, setReferralStats] = useState(null);
  const referralStatsData = useSelector(
    (state) => state?.levelBonus?.referralStats
  );

  useEffect(() => {
    if (referralStatsData) {
      setReferralStats(referralStatsData);
    }
  }, [referralStatsData]);

  return (
    <Card>
      <CardContent>
        <Box
          sx={{
            gap: 2,
            display: "flex",
            alignItems: "stretch",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              gap: 1.75,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <Typography
                variant="h4"
                sx={{ mb: 0.5, color: "", fontWeight: 700 }}
              >
                Downline Team
              </Typography>
              <Typography variant="h6" sx={{ my: 2 }}>
                Total : {referralStats?.downlineReferral || 'N/A'}
              </Typography>
              <Typography variant="h6" sx={{ my: 2 }}>
                Active : {referralStats?.activeDownlineReferrals || 'N/A'}
              </Typography>
              <Box sx={{}}>
                <Typography variant="h6" sx={{ my: 2 }}>
                  In-Active : {referralStats?.pendingDownlineReferrals || 'N/A'}
                </Typography>
                <Typography variant="h6" sx={{ my: 2 }}>
                  Total Business : {`$${referralStats?.directDownlineBussiness && oneUSDC ? kgcToUSDC(referralStats?.directDownlineBussiness, oneUSDC) : 0}`}
                </Typography>
              </Box>
            </div>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default DownlineTeam;
