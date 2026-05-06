import React, { useEffect, useState } from "react";
// ** MUI Imports
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";

// ** Custom Component Import
import CustomTextFieldWithButton from "src/@core/components/mui/text-field-button";

//ENV
import { ENV } from "src/configs/env";

import { useSelector } from "react-redux";

const ReferralLinks = () => {
  const [referralValue, setReferralValue] = useState("");
  const user = useSelector((state) => state?.getCurrentUser?.user?.data);
  useEffect(() => {
    if (user?._id) {
      setReferralValue(ENV?.frontendBaseUrl + `/signup?referral_id=${user?.userName}`);
    }
  }, [user]);

  return (
    <Card sx={{ p: 0 }}>
      <CardHeader sx={{ fontSize: 30 }} title="Referral Links" />

      <CardContent>
        <Typography variant="p" sx={{ color: "" }}>
          Refer your friends & family to earn more crypto.
        </Typography>
        <Grid container spacing={5}>
          <Grid item xs={12} sx={{ mt: 4, mb: 4 }}>
            <CustomTextFieldWithButton
              disabled
              fullWidth
              value={referralValue}
              placeholder="Referral Address"
            />
          </Grid>
        </Grid>
        <Typography variant="p" sx={{ color: "" }}>
          Copy (BRC) Smart Contract address .
        </Typography>
        <Grid container spacing={5}>
          <Grid item xs={12} sx={{ mt: 4 }}>
            <CustomTextFieldWithButton
              disabled
              fullWidth
              label=""
              value={ENV?.dashboardKGCAddress}
              placeholder="BRC Smart Contract address"
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ReferralLinks;
