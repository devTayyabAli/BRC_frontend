import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import BlankLayout from "src/@core/layouts/BlankLayout";
import FooterIllustrations from "src/views/pages/misc/FooterIllustrations";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import NetworkSelector from "src/views/components/choose-network-modal";
import isMobile from "is-mobile";
import WalletConnection from "../wallet-connection-error"
const BoxWrapper = styled(Box)(({ theme }) => ({
  [theme.breakpoints.down("md")]: {
    width: "90vw",
  },
}));

const Img = styled("img")(({ theme }) => ({
  [theme.breakpoints.down("lg")]: {
    height: 450,
    marginTop: theme.spacing(10),
  },
  [theme.breakpoints.down("md")]: {
    height: 400,
  },
  [theme.breakpoints.up("lg")]: {
    marginTop: theme.spacing(20),
  },
}));

const WalletConnectionError = () => {
   return (
    <WalletConnection/>
   
  );
};

WalletConnectionError.getLayout = (page) => <BlankLayout>{page}</BlankLayout>;
WalletConnectionError.guestGuard = true;
export default WalletConnectionError;
