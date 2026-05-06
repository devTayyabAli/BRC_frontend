// ** MUI Imports
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import { useSelector } from "react-redux";
const AccountDetails = () => {
  const user = useSelector((state) => state?.getCurrentUser?.user?.data);
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
                BRC : Account details
              </Typography>
              <Typography variant="h6" sx={{ my: 2 }}>
                Full Name : {user?.name || ""}
              </Typography>
              <Typography variant="h6" sx={{ my: 2 }}>
                Your ID : {user?.userName || ""}
              </Typography>
              <Box sx={{}}>
                <Typography variant="h6" sx={{ my: 2 }}>
                  Email : {user?.email || ""}
                </Typography>
                <Typography variant="h6" sx={{ my: 2 }}>
                  Wallet address :{" "}
                  {user?.walletAddress?.slice(0, 6) +
                    "...." +
                    user?.walletAddress?.slice(-6) || ""}
                </Typography>
              </Box>
            </div>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AccountDetails;
