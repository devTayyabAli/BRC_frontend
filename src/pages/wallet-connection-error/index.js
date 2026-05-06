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
  const user = useSelector((state) => state?.login?.user?.data);
  const [walletAddress, setWalletAddress] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const { open } = useWeb3Modal();
  const { address } = useAccount();
  const router = useRouter();
  const backgroundImageUrl = "pre-loader-new";
  useEffect(() => {
    if (user) {
      setWalletAddress(user?.walletAddress);
    }
  }, [user]);
  useEffect(() => {
    if (
      address &&
      walletAddress &&
      address === walletAddress &&
      window?.ethereum
    ) {
      router?.back();
    }
  }, [walletAddress, address]);
  const connectWallet = () => {
    if (isMobile() && !window.ethereum) {
      return setOpenModal(true);
    }
    open({ view: "Networks" });
  };
  return (
    <Box className="content-center">
      {/* <Button
        onClick={handleGoBack}
        type="button"
        variant="contained"
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          margin: "16px",
          zIndex: 1000,
        }}
      >
        Go Back
      </Button> */}
      <NetworkSelector open={openModal} onClose={() => setOpenModal(false)} />
      <Box
        sx={{
          p: 5,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <BoxWrapper>
          {!address || !window?.ethereum ? (
            <>
              <Typography variant="h4" sx={{ mt: 10 }}>
                Wallet Not Connected :(
              </Typography>
              <Button
                onClick={() => connectWallet()}
                fullWidth
                type="button"
                variant="contained"
                sx={{ mt: 5 }}
              >
                Connect Wallet
              </Button>
            </>
          ) : address && address !== walletAddress ? (
            <>
              <Typography variant="h4" sx={{ mt: 10 }}>
                Current wallet address does not match with the user's wallet
                address :(
              </Typography>
              <Typography variant="h4" sx={{ mt: 10 }}>
                Please switch to this wallet address {walletAddress}
              </Typography>
              {/* <Button
                onClick={() => handleDisConnect()}
                type="button"
                variant="contained"
                style={{ marginTop: "2rem" }}
                // sx={{
                //   position: "absolute",
                //   top: 0,
                //   left: 0,
                //   margin: "16px",
                //   zIndex: 1000,
                // }}
              >
                Disconnect
              </Button> */}
            </>
          ) : (
            <>
              <Typography variant="h4" sx={{ mt: 10 }}>
                Connected:{address}
              </Typography>
              <Typography variant="h4" sx={{ mt: 10 }}>
                Redirecting.....
              </Typography>
            </>
          )}
        </BoxWrapper>
        <Img
          className="wallet-connection-error-img"
          alt="wallet-error-illustration"
          src={`/images/pages/${backgroundImageUrl}.png`}
        />
      </Box>
      <FooterIllustrations />
    </Box>
  );
};

WalletConnectionError.getLayout = (page) => <BlankLayout>{page}</BlankLayout>;
export default WalletConnectionError;
