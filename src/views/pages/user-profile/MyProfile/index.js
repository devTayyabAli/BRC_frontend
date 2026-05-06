// ** MUI Components
import Grid from "@mui/material/Grid";

// ** Demo Components
import { Typography, Box, Card } from "@mui/material";

const MyProfile = () => {
  return (
    <>
      <Box>
        <Typography variant="h4">PERSONAL INFORMATION</Typography>
        <Grid container spacing={6} sx={{ py: 4 }}>
          <Grid item xs={12} md={6} lg={3}>
            User ID
          </Grid>
          <Grid item xs={12} md={6} lg={9}>
            UsamaM
          </Grid>
        </Grid>
        <Grid container spacing={6} sx={{ py: 4 }}>
          <Grid item xs={12} md={6} lg={3}>
            Full Name
          </Grid>
          <Grid item xs={12} md={6} lg={9}>
            UsamaMehmood
          </Grid>
        </Grid>
      </Box>
      <Box>
        <Typography variant="h4">Contact Info</Typography>
        <Grid container spacing={6} sx={{ py: 4 }}>
          <Grid item xs={12} md={6} lg={3}>
            Email address(required)
          </Grid>
          <Grid item xs={12} md={6} lg={9}>
            usama.mehmood@invozone.dev
          </Grid>
        </Grid>
        <Grid container spacing={6} sx={{ py: 4 }}>
          <Grid item xs={12} md={6} lg={3}>
            Phone
          </Grid>
          <Grid item xs={12} md={6} lg={9}></Grid>
        </Grid>
        <Grid container spacing={6} sx={{ py: 4 }}>
          <Grid item xs={12} md={6} lg={3}>
            Country
          </Grid>
          <Grid item xs={12} md={6} lg={9}></Grid>
        </Grid>
        <Grid container spacing={6} sx={{ py: 4 }}>
          <Grid item xs={12} md={6} lg={3}>
            Address
          </Grid>
          <Grid item xs={12} md={6} lg={9}></Grid>
        </Grid>
      </Box>
    </>
  );
};

export default MyProfile;
