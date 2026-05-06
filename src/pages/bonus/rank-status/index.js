import React from "react";
import { Box, Typography, Grid } from "@mui/material";
import RankCard from "./rank-card";
import { getRankData } from "src/store/apps/bonus/bonusSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const RankStatus = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state?.getCurrentUser?.user?.data);
  const rankData = useSelector((state) => state?.bonus?.rankData);
  const [userId, setUserId] = useState(null);
  const [rankStatusData, setRankStatusData] = useState(null);
  useEffect(() => {
    if (currentUser) {
      setUserId(currentUser?._id);
    }
  }, [currentUser]);

  useEffect(() => {
    if(userId){
      dispatch(getRankData(userId));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    if(rankData && rankData?.data && rankData?.data?.length > 0){
      setRankStatusData(rankData?.data);
    }
  }, [rankData]);

  return (
    <>
      <Box sx={{ my: 4 }}>
        <Typography variant="p" sx={{ color: "#C9A84C", my: 4 }}>
          Note : In Rank Reward Only Direct Active ID and Direct Active ID Downline Team & Business
          will be count. In-Active Direct ID and In-Active Direct ID Downline Team & Business will
          be not count.
        </Typography>
      </Box>
      <Box sx={{ mb: 8 }}>
        <Grid container spacing={6}>
          {rankStatusData && rankStatusData?.length > 0 && rankStatusData?.map((rank, index) => (
            <Grid key={index} item xs={12} md={12} lg={4}>
              <RankCard rank={rank} index={index} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
};

export default RankStatus;