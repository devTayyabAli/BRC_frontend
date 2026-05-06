// ** React Imports
import { useContext, useEffect, useState } from "react";

// ** MUI Components
import Card from "@mui/material/Card";
import { Box, Grid } from "@mui/material";
import CardHeader from "@mui/material/CardHeader";
import { useDispatch, useSelector } from "react-redux";
import { kycIno } from "src/store/apps/kyc/getKYCInfoSlice";
import { kycStatus } from "src/constants/common";
import SocketContext from "src/context/Socket";
import moment from "moment";
const KYCDetails = () => {
  // ** State
  const [data, setData] = useState([]);
  const dispatch = useDispatch();
  const { kycInfo } = useSelector((state) => state.kyc);
  const currentUser = useSelector((state) => state?.getCurrentUser?.user?.data);

  //socket
  const socket = useContext(SocketContext);
  useEffect(()=>{
    if(currentUser){
      dispatch(kycIno(currentUser?._id));
    }

  },[currentUser])

  useEffect(() => {
    if (socket && currentUser?._id) {
      socket?.emit("join", currentUser?._id); // replace userId
      socket?.on("kycUpdated", ({}) => {
        dispatch(kycIno(currentUser?._id));
      });

      return () => {
        socket.emit("leave", currentUser?._id); // replace userId
      };
    }
  }, [socket, currentUser?._id]);

  return data ? (
    <Card>
      <CardHeader
        title="KYC Details"
        titleTypographyProps={{ sx: { mb: [2, 0] } }}
        sx={{
          py: 4,
          flexDirection: ["column", "row"],
          "& .MuiCardHeader-action": { m: 0 },
          alignItems: ["flex-start", "center"],
        }}
      />

      <Box sx={{ padding: "1.5rem" }}>
        <Grid container spacing={6} sx={{ padding: "1rem 0rem" }}>
          <Grid item xs={12} md={12} lg={3}>
            Status:
          </Grid>
          <Grid item xs={12} md={12} lg={9}>
            {kycStatus[kycInfo?.status] || "-"}
          </Grid>
        </Grid>
        <Grid container spacing={6} sx={{ padding: "1rem 0rem" }}>
          <Grid item xs={12} md={12} lg={3}>
            Merchant Reference:
          </Grid>
          <Grid item xs={12} md={12} lg={9}>
            {kycInfo?.refId || "-"}
          </Grid>
        </Grid>

        <Grid container spacing={6} sx={{ padding: "1rem 0rem" }}>
          <Grid item xs={12} md={12} lg={3}>
            Submitted Date:
          </Grid>
          <Grid item xs={12} md={12} lg={9}>
            {(kycInfo?.waitingDate &&
              moment(kycInfo?.waitingDate)?.format("MM YYYY hh:mm")) ||
              "-"}
          </Grid>
        </Grid>
        <Grid container spacing={6} sx={{ padding: "1rem 0rem" }}>
          <Grid item xs={12} md={12} lg={3}>
            Operator:
          </Grid>
          <Grid item xs={12} md={12} lg={9}>
            {kycInfo?.identities?.email?.value || "-"}
          </Grid>
        </Grid>
      </Box>
    </Card>
  ) : (
    "No Data Available"
  );
};

export default KYCDetails;
