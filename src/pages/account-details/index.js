import { Card, Grid, Typography } from '@mui/material'
import React from 'react'
import { ENV } from 'src/configs/env'
import AccountDetails from 'src/views/dashboards/analytics/AccountDetails'
import ReferralLinks from 'src/views/dashboards/analytics/referralLink'

export default function UserDetails() {
  return (
    <div>
      <Card sx={{ mb: 4, backgroundColor: "#fff", p: 3, color: "#000" }}>
        <Typography variant="p" sx={{ color: "#7f7f81", fontSize: 14 }}>
          <span style={{ fontSize: "14px", color: "#ffb237" }}>
            PHISHING WARNING:
          </span>{" "}
          please make sure you're visiting{" "}
          <span style={{ color: "#666667", fontWeight: 700 }}>
            <a href={ENV.frontendBaseUrl} target="_blank">{ENV.frontendBaseUrl}</a>
          </span>{" "}
          - check the URL carefully.
        </Typography>
      </Card>
      <Grid container spacing={6}>
        <Grid item xs={12} md={6} lg={12}>
          <AccountDetails />
        </Grid>

        <Grid item xs={12} md={12} lg={12}>
          <ReferralLinks />
        </Grid>
      </Grid>
    </div>
  )
}
