// ** React Imports
import { useState, useEffect,useContext } from "react";

// ** MUI Components
import Box from "@mui/material/Box";
import Image from "next/image";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";

// ** Third Party Imports
import axios from "axios";

// ** Icon Imports
import Icon from "src/@core/components/icon";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { kycIno } from "src/store/apps/kyc/getKYCInfoSlice";
import { capitalizeEachWord, findHighestRankTillSeven, kycStatus, ReconnectKycStatus, renderStars } from "src/constants/common";
import { ENV } from "src/configs/env";
import SocketContext from "src/context/Socket";
const ProfilePicture = styled("img")(({ theme }) => ({
  width: 108,
  height: 108,
  borderRadius: "20px",
  border: `4px solid ${theme.palette.common.white}`,
  [theme.breakpoints.down("md")]: {
    marginBottom: theme.spacing(4),
  },
}));

const UserProfileHeader = () => {
  // ** State
  const router = useRouter();
  const [data, setData] = useState(null);
  const currentUser = useSelector((state) => state?.getCurrentUser?.user?.data);
  const dispatch = useDispatch();
  const socket = useContext(SocketContext);
  const { kycInfo } = useSelector((state) => state.kyc);
  const [referralStats, setReferralStats] = useState(null);
  const referralStatsData = useSelector(
    (state) => state?.levelBonus?.referralStats
  );

  useEffect(() => {
    if (referralStatsData) {
      setReferralStats(referralStatsData);
    }
  }, [referralStatsData]);

  useEffect(() => {
    axios.get("/pages/profile-header").then((response) => {
      setData(response.data);
    });
  }, []);
  useEffect(() => {
    if (
      data !== null &&
      currentUser?._id &&
      (!currentUser?.kycStatus ||
        ReconnectKycStatus.includes(currentUser?.kycStatus) ||
        currentUser?.kycStatus === "pending")
    ) {
      loadBlockpassWidget();
    }
  }, [data, currentUser]);

  const loadBlockpassWidget = () => {
    const blockpass = new window.BlockpassKYCConnect(
      ENV.kycClientId, // service client_id from the admin console
      {
        refId: currentUser?._id, // assign the local user_id of the connected user
        email: currentUser?.email
      }
    );

    blockpass.startKYCConnect();

    blockpass.on("KYCConnectSuccess", () => {
      //add code that will trigger when data have been sent.
    });
  };

  useEffect(() => {
    if (currentUser && currentUser.kycStatus !== "pending") {
      dispatch(kycIno(currentUser?._id));
    }
  }, [currentUser]);

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

  return (
    <Card>
      {/* <CardMedia
        component="img"
        alt="profile-header"
        image={data?.coverImg}
        sx={{
          height: { xs: 150, md: 250 },
        }}
      /> */}
      <CardContent
        sx={{
          pt: 0,
          mt: 5,
          display: "flex",
          alignItems: "flex-end",
          flexWrap: { xs: "wrap", md: "nowrap" },
          justifyContent: { xs: "center", md: "flex-start" },
        }}
      >
        <ProfilePicture
          src={currentUser?.profilePicture}
          alt="profile-picture"
        />

        <Box
          sx={{
            width: "100%",
            display: "flex",
            ml: { xs: 0, md: 6 },
            alignItems: "flex-end",
            flexWrap: ["wrap", "nowrap"],
            justifyContent: ["center", "space-between"],
          }}
        >
          <Box
            sx={{
              mb: [6, 0],
              display: "flex",
              flexDirection: "column",
              alignItems: ["center", "flex-start"],
            }}
          >
      <Typography variant="h5" style={{ display: 'flex', alignItems: 'center' }}>
        <span>{capitalizeEachWord(currentUser?.name)}</span>
        <span style={{ marginLeft: '0.5em' }}>{renderStars(referralStats?.userRank ? referralStats?.userRank : 0,7)}</span>
      </Typography>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: ["center", "flex-start"],
              }}
            >
              <Box
                sx={{
                  mr: 4,
                  display: "flex",
                  alignItems: "center",
                  "& svg": { mr: 1.5, color: "text.secondary" },
                }}
              >
                <Typography variant="h5" sx={{ color: "text.secondary" }}>
                  Direct Team :{" "}
                  <span sx={{ color: "#EA5455" }}>
                    {referralStats?.directReferral || 0}
                  </span>
                </Typography>
              </Box>
              <Box
                sx={{
                  mr: 4,
                  display: "flex",
                  alignItems: "center",
                  "& svg": { mr: 1.5, color: "text.secondary" },
                }}
              >
                <Typography variant="h5" sx={{ color: "text.secondary" }}>
                  Downline Team :{" "}
                  <span sx={{ color: "#EA5455" }}>
                    {referralStats?.downlineReferral || 0}
                  </span>
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box sx={{
            display: "flex",
            alignItems: "center",
          }}>
            <Button variant="contained" sx={{ "& svg": { mr: 2 } }} onClick={() => router.push('/pages/account-settings/account/')}>
              <Icon icon="tabler:edit" fontSize="1.125rem" />
              Edit Profile
            </Button>
            <Button
              variant="contained"
              id="blockpass-kyc-connect"
              sx={{ "& svg": { mr: 2 } }}
              style={{ marginLeft: "0.75rem" }}
              disabled={!currentUser?._id}
              onClick={() => {
                if (
                  kycInfo?.status &&
                  !ReconnectKycStatus.includes(currentUser?.kycStatus)
                ) {
                  router.push("/kyc-details");
                }
              }}
            >
              {ReconnectKycStatus.includes(currentUser?.kycStatus)
                ? "Re-Connect KYC"
                : kycInfo?.status
                ? "KYC : " + kycStatus[kycInfo?.status]
                : "Connect KYC"}
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default UserProfileHeader;
