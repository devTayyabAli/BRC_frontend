// ** MUI Import
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import useGetKGCLiveTokens from "src/hooks/useGetKGCLiveTokens";
import { formatNumber, toFixedDecimal } from "src/constants/common";
import { useSettings } from "src/@core/hooks/useSettings";

const TokenAudit = () => {
  const { settings, saveSettings } = useSettings()

  const { kgcTokens: kgcLiveRate } = useGetKGCLiveTokens(1);
  const handleClick = () => {
    // Open the PDF file in a new tab and initiate the download
    window.open('/assets/pdf/KGC.pdf', '_blank');
  };
  return (
    <Card>
      <CardContent>
        <Typography variant="h2" sx={{ textAlign: "center", pb: 6 }}>
          BRC TOKEN AUDITED FROM CERTIK
        </Typography>
        <Grid container spacing={6} sx={{ alignItems: "center" }}>
          {/* <Grid item xs={12} md={5} lg={6}>
            <Box sx={{ border: 2, borderRadius: 2 }}>
              <Box sx={{ borderBottom: "1px solid", py: 4 }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box sx={{ mr: 4, flex: "0 0 25%", textAlign: "center" }}>
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
                  <Box sx={{ flex: "0 0 75%" }}>
                    <Typography
                      variant="span"
                      sx={{ textDecoration: "uppercase", mt: 4, color: "" }}
                    >
                      BRC Live Rate
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "baseline" }}>
                      <Typography
                        variant="h4"
                        sx={{ mt: 1, mb: 0, color: "", fontWeight: 600, fontSize: 20 }}
                      >
                         {formatNumber(kgcLiveRate, toFixedDecimal) || 0}
                      </Typography>
                      <Typography variant="span" sx={{ mt: "auto", ml: 2 }}>
                        BRC{" "}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
              <Box sx={{ display: "flex" }}>
                <Box sx={{ flex: "0 0 33%", textAlign: "center", borderRight: 1, py: 4 }}>
                  <Box>RANK</Box>
                  <Box>3045</Box>
                </Box>
                <Box sx={{ flex: "0 0 33%", textAlign: "center", borderRight: 1, py: 4 }}>
                  <Box>MARKET CAP</Box>
                  <Box>$154.04 K USD</Box>
                </Box>
                <Box sx={{ flex: "0 0 33%", textAlign: "center", py: 4 }}>
                  <Box>VOLUME</Box>
                  <Box>$154.04 K USD</Box>
                </Box>
              </Box>
              <Box sx={{ p: 2.5, textAlign: "center", color: "#EA5455" }}>
                Powered by CoinnMarketCap
              </Box>
            </Box>
          </Grid> */}
          <Grid item xs={12} md={6} lg={6}>
            <Box>
              <Button
                fullWidth
                type="submit"
                onClick={handleClick}
                sx={{
                  mr: 2,
                  mb: 4,
                  py: 4,
                  borderRadius: "20px",

                  background: settings?.mode == "dark" ? 'linear-gradient(135deg, transparent 20%, rgba(255, 215, 0, 0.2) 50%)' : 'linear-gradient(135deg, rgba(16, 16, 16, 0.8) 20%, #ea5455 50%)',
                  border: "1px solid #fff",
                  "&:hover": {
                    backgroundColor: "#238276",
                  },
                }}
                variant="contained"
              >
                Download BRC Token Business Plan
              </Button>
              <Button
                fullWidth
                type="submit"
                sx={{
                  mr: 2,
                  mb: 4,
                  py: 4,
                  borderRadius: "20px",

                  background: settings?.mode == "dark" ? 'linear-gradient(135deg, rgba(255, 215, 0, 0.2) 20%, transparent 50%)' : 'linear-gradient(135deg, #ea5455 20%, rgba(16, 16, 16, 0.8) 50%)',
                  border: "1px solid #fff",
                  "&:hover": {
                    backgroundColor: "#238276",
                  },
                }}
                variant="contained"
              >
                View on Certik Official website
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <Box>
              <Button
                fullWidth
                type="submit"
                sx={{
                  mr: 2,
                  mb: 4,
                  py: 4,
                  borderRadius: "20px",

                  background: settings?.mode == "dark" ? 'linear-gradient(135deg, rgba(255, 215, 0, 0.2) 20%, transparent 50%)' : 'linear-gradient(135deg, #ea5455 20%, rgba(16, 16, 16, 0.8) 50%)',
                  border: "1px solid #fff",
                  "&:hover": {
                    backgroundColor: "#238276",
                  },
                }}
                variant="contained"
              >
                View on Coinmarketcap Official website
              </Button>
              <Button
                fullWidth
                type="submit"
                sx={{
                  mr: 2,
                  mb: 4,
                  py: 4,
                  borderRadius: "20px",

                  background: settings?.mode == "dark" ? 'linear-gradient(135deg, transparent 20%, rgba(255, 215, 0, 0.2) 50%)' : 'linear-gradient(135deg, rgba(16, 16, 16, 0.8) 20%, #ea5455 50%)',
                  border: "1px solid #fff",
                  "&:hover": {
                    backgroundColor: "#238276",
                  },
                }}
                variant="contained"
              >
                Download Certik Audit Report
              </Button>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default TokenAudit;
