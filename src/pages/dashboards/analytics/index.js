// ** MUI Import
import Grid from "@mui/material/Grid";

// ** Demo Component Imports
import AnalyticsProject from "src/views/dashboards/analytics/AnalyticsProject";
import Card from "@mui/material/Card";
import { Box, CardContent, Typography } from "@mui/material";
import RewardCard from "./rewardCards";
import ReferralLinks from "src/views/dashboards/analytics/referralLink";
import AvailableBalance from "src/views/dashboards/analytics/AvailableBalance";
import AvailableStake from "src/views/dashboards/analytics/AvailableStake";
import AccountDetails from "src/views/dashboards/analytics/AccountDetails";
import DirectTeam from "src/views/dashboards/analytics/DirectTeam";
import DownlineTeam from "src/views/dashboards/analytics/DownlineTeam";
import CappingStatus from "src/views/dashboards/analytics/CappingStatus";
import TokenAudit from "src/views/dashboards/analytics/TokenAudit";
import UserProfileHeader from "src/views/pages/user-profile/UserProfileHeader";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getReferralStats } from "src/store/apps/levelBonus/levelBonusSlice";
import { capitalizeFirstLetter, formatNumber, kgcToUSDC, toFixedDecimal } from "src/constants/common";
import { ENV } from "src/configs/env";
import { useAccount } from "wagmi";
import { useContractRegister } from "src/hooks/useContractRegister";
import useGetUSDCTokens from "src/hooks/useGetUSDCTokens";
import { getNewsBanner } from "src/store/apps/support/supportTicketsSlice";

const bonusTitles = ["Staking Bonus", "Leadership Bonus", "Level Bonus", "Instant Bonus"];


const AnalyticsDashboard = () => {
  const dispatch = useDispatch();
  const { address } = useAccount();
  const currentUser = useSelector((state) => state?.getCurrentUser?.user?.data);
  const { getNewsBannerValue, loading } = useSelector((state) => state?.support);
  const referralStatsData = useSelector(
    (state) => state?.levelBonus?.referralStats
  );
  let bannerURL = getNewsBannerValue[0]?.picture[0]?.url

  const {
    tokenBlnc: availableKGC,
  } = useContractRegister(address);

  const { tokenBlnc: oneUSDC } = useGetUSDCTokens(1);

  useEffect(() => {
    dispatch(getReferralStats());
    dispatch(getNewsBanner());

  }, [dispatch]);

  const rewards = useMemo(() => {
    return [
      {
        title: "Account Status",
        worth: "",
        status: capitalizeFirstLetter(currentUser?.status) || "N/A",
        stats: ""
      },
      {
        title: "Staking Bonus",
        worth: referralStatsData?.stakingRewardBonus || 0,
        status: "",
      },
      {
        title: "Level Bonus",
        worth: referralStatsData?.referralLevelBonus || 0,
        status: "",
      },
      {
        title: "Leadership Bonus",
        worth: referralStatsData?.leadershipBonus || 0,
        status: "",
      },
      {
        title: "Instant Bonus",
        worth: referralStatsData?.instantRewardBonus || 0,
        status: "",
      },
      {
        title: "Total Bonus",
        worth: referralStatsData?.totalBonus || 0,
        status: "",
      },
      {
        title: "Total Withdrawal",
        worth: referralStatsData?.totalWithdrawal || 0,
        status: "",
      },
      {
        title: "Available Balance",
        worth: referralStatsData?.availableBonusBalance || 0,
        status: "",
      },
    ];
  }, [referralStatsData, currentUser]);

  const handleWhatsAppClick = () => {
    const url = `https://wa.me/${ENV.whatsappUrl}`;
    window.open(url, '_blank');
  };
  return (
    <>

      {/* <Card sx={{ mb: 4, backgroundColor: "#fff", p: 3, color: "#000" }}>
        <Typography variant="p">
          <span style={{ color: "#2a9760", fontSize: "14px" }}>
            BRC Technical Support Number:
          </span>
          <span
            style={{ color: "#7f7f81", fontSize: "14px", paddingLeft: "5px" }}
          >
            Only WhatsApp. No Calls. <a style={{ color: "#551A8B", textDecoration: "underline", fontWeight: 700, cursor: "pointer" }} onClick={handleWhatsAppClick}>{ENV.whatsappUrl}</a>
          </span>
        </Typography>
      </Card> */}
      <Grid container spacing={6}>
        <Grid item xs={12} md={12} lg={12}>
          <UserProfileHeader />
        </Grid>
        {rewards?.map((reward, index) => (
          <Grid key={index} item xs={6} md={6} lg={4}>
            <RewardCard
              title={reward?.title}
              worth={reward?.worth}
              status={reward?.status}
            // stats={reward.stats}
            />
          </Grid>
        ))}

        <Grid item xs={12} md={12} lg={12}>
          <Card sx={{
            display: "flex", justifyContent: "center", alignItems: 'center', padding: "0px",
            height: !bannerURL ? "14rem" :"auto"
          }}>
            <CardContent sx={{ display: "flex", justifyContent: "center", alignItems: 'center' }}>
              {/* <Image src= */}
              {
                bannerURL ?
                  <img alt={"News Banner"} src={bannerURL} style={{ width: "100%", borderRadius: "10px" }} />
                  :
                  <Typography sx={{ fontSize: 18, color: "", fontWeight: 400, }}>
                    New update not available
                  </Typography>

              }

            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={12} lg={12}>
          <CappingStatus />
        </Grid>

        <Grid item xs={12} md={6} lg={5}>
          <DirectTeam />
        </Grid>
        <Grid item xs={12} md={6} lg={7}>
          <DownlineTeam />
        </Grid>
        <Grid item xs={12} md={5}>
          <AvailableBalance />
        </Grid>
        <Grid item xs={12} md={7}>
          <AvailableStake />
        </Grid>

        {/* <Grid item xs={12} md={12} lg={12}>
          <ReferralLinks />
        </Grid> */}
        {/* <Grid item xs={12} md={12} lg={12}>
          <TokenAudit />
        </Grid> */}


        <Grid item xs={12} lg={12}>
          <AnalyticsProject />
        </Grid>
      </Grid>
    </>
  );
};

export default AnalyticsDashboard;