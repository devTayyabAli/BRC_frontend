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
import { useState } from "react";

const BuyFund = () => {
  const [contribution, setContribution] = useState(true);

  return (
    <Card sx={{ p: 8 }}>
      <Card sx={{ border: 1 }}>
        <CardHeader
          sx={{ textAlign: "center", py: 8, fontSize: 24 }}
          title={contribution === true ? "Stake BRC" : "Pay $3 for LP (Liquidity pool)"}
        />
        <Divider sx={{ m: "0 !important" }} />
        <form onSubmit={(e) => e.preventDefault()}>
          <CardContent>
            <Grid container spacing={5}>
              <Grid item xs={12}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Enter Amount ($)*
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <CustomTextField fullWidth label="" placeholder="Enter Withdrawal amount ($)" />
              </Grid>
            </Grid>
            <Grid container spacing={5} sx={{ mt: 4 }}>
              <Grid item xs={12}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  BRC Token Amount*
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <CustomTextField fullWidth label="" placeholder="Enter Token amount" />
              </Grid>
            </Grid>
            <Box sx={{ display: "flex", mt: 10, alignItems: "center" }}>
              <Box sx={{ mr: 4 }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32">
                  <g fill="none">
                    <circle cx="16" cy="16" r="16" fill="#F3BA2F" />
                    <path
                      fill="#FFF"
                      d="M12.116 14.404L16 10.52l3.886 3.886 2.26-2.26L16 6l-6.144 6.144 2.26 2.26zM6 16l2.26-2.26L10.52 16l-2.26 2.26L6 16zm6.116 1.596L16 21.48l3.886-3.886 2.26 2.259L16 26l-6.144-6.144-.003-.003 2.263-2.257zM21.48 16l2.26-2.26L26 16l-2.26 2.26L21.48 16zm-3.188-.002h.002v.002L16 18.294l-2.291-2.29-.004-.004.004-.003.401-.402.195-.195L16 13.706l2.293 2.293z"
                    />
                  </g>
                </svg>
              </Box>
              <Box>
                <Typography variant="span" sx={{ textDecoration: "uppercase", mt: 4, color: "" }}>
                  BRC Live Rate
                </Typography>
                <Box sx={{ display: "flex", alignItems: "baseline" }}>
                  <Typography
                    variant="h4"
                    sx={{ mt: 1, mb: 0, color: "", fontWeight: 600, fontSize: 20 }}
                  >
                    219.30000
                  </Typography>
                  <Typography variant="span" sx={{ mt: "auto", ml: 2 }}>
                    BRC
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box sx={{ display: "flex", mt: 6, alignItems: "center" }}>
              <Box sx={{ mr: 4 }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32">
                  <g fill="none">
                    <circle cx="16" cy="16" r="16" fill="#F3BA2F" />
                    <path
                      fill="#FFF"
                      d="M12.116 14.404L16 10.52l3.886 3.886 2.26-2.26L16 6l-6.144 6.144 2.26 2.26zM6 16l2.26-2.26L10.52 16l-2.26 2.26L6 16zm6.116 1.596L16 21.48l3.886-3.886 2.26 2.259L16 26l-6.144-6.144-.003-.003 2.263-2.257zM21.48 16l2.26-2.26L26 16l-2.26 2.26L21.48 16zm-3.188-.002h.002v.002L16 18.294l-2.291-2.29-.004-.004.004-.003.401-.402.195-.195L16 13.706l2.293 2.293z"
                    />
                  </g>
                </svg>
              </Box>
              <Box>
                <Typography variant="span" sx={{ textDecoration: "uppercase", mt: 4, color: "" }}>
                  AVAILABLE
                </Typography>
                <Box sx={{ display: "flex", alignItems: "baseline" }}>
                  <Typography
                    variant="h4"
                    sx={{ mt: 1, mb: 0, color: "", fontWeight: 600, fontSize: 20 }}
                  >
                    0.00000
                  </Typography>
                  <Typography variant="span" sx={{ mt: "auto", ml: 2 }}>
                    BRC
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box sx={{ display: "flex", mt: 6, alignItems: "center" }}>
              <Box sx={{ mr: 4 }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32">
                  <g fill="none">
                    <circle cx="16" cy="16" r="16" fill="#F3BA2F" />
                    <path
                      fill="#FFF"
                      d="M12.116 14.404L16 10.52l3.886 3.886 2.26-2.26L16 6l-6.144 6.144 2.26 2.26zM6 16l2.26-2.26L10.52 16l-2.26 2.26L6 16zm6.116 1.596L16 21.48l3.886-3.886 2.26 2.259L16 26l-6.144-6.144-.003-.003 2.263-2.257zM21.48 16l2.26-2.26L26 16l-2.26 2.26L21.48 16zm-3.188-.002h.002v.002L16 18.294l-2.291-2.29-.004-.004.004-.003.401-.402.195-.195L16 13.706l2.293 2.293z"
                    />
                  </g>
                </svg>
              </Box>
              <Box>
                <Typography variant="span" sx={{ textDecoration: "uppercase", mt: 4, color: "" }}>
                  AVAILABLE
                </Typography>
                <Box sx={{ display: "flex", alignItems: "baseline" }}>
                  <Typography
                    variant="h4"
                    sx={{ mt: 1, mb: 0, color: "", fontWeight: 600, fontSize: 20 }}
                  >
                    0.00000
                  </Typography>
                  <Typography variant="span" sx={{ mt: "auto", ml: 2 }}>
                    BNB
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                mt: 8,
              }}
            >
              <Typography variant="h5" sx={{ textAlign: "center", mt: 1, mb: 1 }}>
                <Typography variant="span" sx={{ fontSize: 14 }}>
                  Minimum:
                </Typography>
                <Typography variant="span" sx={{ px: 2, color: "", fontWeight: 600 }}>
                  $50
                </Typography>
              </Typography>
              <Typography variant="h5" sx={{ textAlign: "center", mt: 1, mb: 1 }}>
                <Typography variant="span" sx={{ fontSize: 14 }}>
                  Minimum:
                </Typography>
                <Typography variant="span" sx={{ px: 2, color: "", fontWeight: 600 }}>
                  $10000
                </Typography>
              </Typography>
              <Typography variant="h5" sx={{ textAlign: "center", mt: 1, mb: 1 }}>
                <Typography variant="span" sx={{ fontSize: 14 }}>
                  Staking Bonus:
                </Typography>
                <Typography variant="span" sx={{ px: 2, color: "", fontWeight: 600 }}>
                  12.0% Monthly
                </Typography>
              </Typography>
              <Typography variant="h5" sx={{ textAlign: "center", mt: 1, mb: 1 }}>
                <Typography variant="span" sx={{ fontSize: 14 }}>
                  Per day:
                </Typography>
                <Typography variant="span" sx={{ px: 2, color: "", fontWeight: 600 }}>
                  0.40%
                </Typography>
              </Typography>
            </Box>
            <Box sx={{ mt: 4 }}>
              <Typography variant="p" sx={{ color: "#C9A84C", fontSize: 13, textAlign: "center" }}>
                Note : During the payment process, after the completion of payment page will be auto
                refresh to complete the payment. Do not press back or any other event during the
                transaction (decline the transaction).
              </Typography>
            </Box>
            <Typography variant="p" sx={{ color: "#C9A84C", fontSize: 13 }}>
              During the transaction it will be take 3 confirmation from Binance Block Chain
              Network. Don't refresh the page, back or close close button.
            </Typography>
          </CardContent>
          <Divider sx={{ m: "0 !important" }} />
          <CardActions>
            <Button fullWidth type="submit" sx={{ mr: 2 }} variant="contained">
              Deposit
            </Button>
          </CardActions>
        </form>
      </Card>
    </Card>
  );
};

export default BuyFund;
