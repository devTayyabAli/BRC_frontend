import React, { forwardRef } from 'react';
import toast from 'react-hot-toast';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Icon from 'src/@core/components/icon'
import IconButton from "@mui/material/IconButton";
import Fade from "@mui/material/Fade";
import { styled } from "@mui/material/styles";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import isMobile from "is-mobile";

const CustomCloseButton = styled(IconButton)(({ theme }) => ({
  top: 0,
  right: 0,
  color: "grey.500",
  position: "absolute",
  boxShadow: theme.shadows[2],
  transform: "translate(10px, -10px)",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: `${theme.palette.background.paper} !important`,
  transition: "transform 0.25s ease-in-out, box-shadow 0.25s ease-in-out",
  "&:hover": {
    transform: "translate(7px, -5px)",
  },
}));

const Transition = forwardRef(function Transition(props, ref) {
  return <Fade ref={ref} {...props} />;
});

const METAMASK_WALLET_ID = process.env.NEXT_PUBLIC_METAMASK_WALLET_ID;

const networks = [
  { 
    name: 'Metamask', 
    icon: <img style={{ width: "40px", height: "40px" }} src={`/images/pages/metamask.webp`} />, 
    // deepLink is computed at click time (see handleNetworkSelection) to capture the current URL
    getDeepLink: () => `https://metamask.app.link/dapp/${window.location.host + window.location.pathname + window.location.search}`,
    walletId: METAMASK_WALLET_ID,
  },
  { 
    name: 'Trust Wallet', 
    icon: <img style={{ width: "40px", height: "40px" }} src={`/images/pages/trust-wallet.jpg`} />, 
    deepLink: process.env.NEXT_PUBLIC_TRUST_DEEP_LINK,
    walletId: process.env.NEXT_PUBLIC_TRUST_WALLET_ID 
  },
  { 
    name: 'Token Pocket Wallet', 
    icon: <img style={{ width: "40px", height: "40px" }} src={`/images/pages/token-pocket.webp`} />, 
    deepLink: process.env.NEXT_PUBLIC_TP_DEEP_LINK,
    walletId: process.env.NEXT_PUBLIC_TOKEN_POCKET_WALLET
  },
  { name: 'WalletConnect (Any Wallet)', icon: <Icon icon="tabler:link" fontSize="2.5rem" />, isWalletConnect: true },
];


const NetworkSelector = ({ open, onClose }) => {

  const { open: openWeb3Modal } = useWeb3Modal();

  const handleNetworkSelection = (network) => {
    onClose();

    // "WalletConnect (Any Wallet)" — open the Web3Modal QR/connect flow directly
    if (network.isWalletConnect) {
      openWeb3Modal();
      return;
    }

    const noInjected = typeof window !== "undefined" && !window?.ethereum;

    // On mobile without an injected provider, always prefer the deep link so the
    // wallet app opens directly instead of showing a WalletConnect modal that
    // offers "Chrome" (which cannot complete the handshake).
    const deepLink = network.getDeepLink ? network.getDeepLink() : network.deepLink;
    if (isMobile() && noInjected && deepLink) {
      toast("Opening wallet app… Continue inside your wallet's browser.", {
        icon: "👛",
        duration: 5000,
        style: { borderRadius: "10px", background: "#333", color: "#fff" },
      });
      // Small delay so the toast is visible before navigation
      setTimeout(() => {
        window.location.href = deepLink;
      }, 300);
      return;
    }

    // Desktop, or mobile with an injected provider — open Web3Modal filtered to
    // the specific wallet so the user doesn't have to hunt for it in the list.
    if (network.walletId) {
      openWeb3Modal({ view: "ConnectWallet", walletId: network.walletId });
      return;
    }

    // Last-resort fallback: navigate directly to the deep link
    if (deepLink) {
      window.location.href = deepLink;
    }
  };

  return (
    <div>
      <Dialog
        fullWidth
        open={open}
        scroll="body"
        maxWidth="sm"
        onClose={() => onClose()}
        TransitionComponent={Transition}
        onBackdropClick={() => onClose()}
        sx={{ "& .MuiDialog-paper": { overflow: "visible", maxHeight: "360px", maxWidth: "360px", width: '100%' } }}
      >
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bolder' }}>Connect Wallet</DialogTitle>
        <CustomCloseButton onClick={() => onClose()}>
          <Icon icon="tabler:x" fontSize="1.25rem" />
        </CustomCloseButton>
        <DialogContent>
          <List>
            {networks?.map((network) => (
              <ListItem button key={network?.name} onClick={() => handleNetworkSelection(network)} sx={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                marginBottom: "8px",
              }}>
                <ListItemIcon>{network?.icon}</ListItemIcon>
                <ListItemText primary={network?.name} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default NetworkSelector;