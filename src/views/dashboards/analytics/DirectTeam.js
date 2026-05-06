// ** MUI Imports
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import useGetUSDCTokens from "src/hooks/useGetUSDCTokens";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { kgcToUSDC } from "src/constants/common";

const DirectTeam = () => {
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
                Direct Team
              </Typography>
              <Typography variant="h6" sx={{ my: 2 }}>
                Total : {referralStats?.directReferral || 'N/A'}
              </Typography>
              <Typography variant="h6" sx={{ my: 2 }}>
                Active : {referralStats?.activeDirectReferrals || 'N/A'}
              </Typography>
              <Box sx={{}}>
                <Typography variant="h6" sx={{ my: 2 }}>
                  In-Active : {referralStats?.pendingDirectReferrals || 'N/A'}
                </Typography>
                <Typography variant="h6" sx={{ my: 2 }}>
                  Total Business : {`$${referralStats?.directReferralBussiness && oneUSDC ? kgcToUSDC(referralStats?.directReferralBussiness, oneUSDC) : 0}`}
                </Typography>
              </Box>
            </div>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default DirectTeam;
