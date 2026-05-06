import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import useGetUSDCTokens from "src/hooks/useGetUSDCTokens";
import { styled } from "@mui/material/styles";
import { useSettings } from "src/@core/hooks/useSettings";
// import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { Skeleton } from "@mui/material";

const RewardCard = ({ title, status, stats, worth }) => {
  const { settings, saveSettings } = useSettings()
  const { tokenBlnc: availableUSDC, isLoading, iserror } = useGetUSDCTokens(worth);
  const ShadowWrapper = styled(Box)({
    position: "relative",
    display: "inline-block",
    borderBottom: "5px solid red",
    borderRadius: "26px",
    width: "100%",
    boxShadow: "0px 10px 15px -6px rgba(255, 215, 0, 0.6)"
  });
  return (
    <ShadowWrapper>
      <Card
        sx={{
          position: "relative",
          width: "100%",
          padding: "0px",
          background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.2) 20%, transparent 50%)',
          color: "#C9A84C",
          borderRadius: "20px",
          overflow: "hidden",
          zIndex: 2,
          // height:{xs:"13vh",md:"auto"}
        }}
      >
        <CardContent>
          <Box
            sx={{ gap: 2, display: "flex", alignItems: "stretch", justifyContent: "space-between" }}
          >
            <Box
              sx={{
                gap: 1.75,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              {/* <Box
              sx={{
                backgroundColor: "#C9A84C",
                padding: "10px",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <TrendingUpIcon sx={{ color: "#000", fontSize: "24px" }} />
            </Box> */}
              <div>
                <Typography variant="h4" sx={{ mb: 0.5, color: settings?.mode == "dark" && "#fff", fontSize: { xs: "14px", md: "20px" } }}>
                  {title}
                </Typography>
                <Typography variant="body1" sx={{ fontSize: { xs: "14px", md: "30px" }, color: "", fontWeight: 500, color: settings?.mode == "dark" && "#fff", }}>
                  {status}
                </Typography>
              </div>
              <div>
                {title !== 'Account Status' && (
                  isLoading ? (
                    <>
                      <Skeleton
                        size={24} sx={{ width: "100%", height: "15px", color: settings?.mode == "dark" && "#fff" }} />
                      <Skeleton
                        size={24} sx={{ width: "100%", height: "15px", color: settings?.mode == "dark" && "#fff" }} />
                    </>
                  ) : (
                    <Typography
                      variant="h3"
                      sx={{
                        fontSize: { xs: "14px", md: "30px" },
                        fontWeight: 500,
                        color: settings?.mode == "dark" && "#fff",
                      }}
                    >
                      {
                        iserror ? (
                          "Error..."
                        ) : (
                          <>
                            ${availableUSDC}
                          </>
                        )
                      }

                    </Typography>
                  )
                )}
                {/* <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  "& svg": { mr: 1, color: "success.main" },
                }}
              >
                <Icon icon="tabler:chevron-up" fontSize="1.25rem" />
                <Typography variant="h6" sx={{ color: "success.main" }}>
                  {stats}
                </Typography>
              </Box> */}
              </div>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </ShadowWrapper>
    // <Card sx={{borderRadius:"20px"}}>

    // </Card>
  );
};

export default RewardCard;
