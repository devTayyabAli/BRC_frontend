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
    deepLink: process.env.NEXT_PUBLIC_METAMASK_DEEP_LINK,
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
    if (network.isWalletConnect) {
      openWeb3Modal();
    } else if (network.walletId) {
      const noInjected = typeof window !== "undefined" && !window?.ethereum;
      const isMetaMaskRow =
        METAMASK_WALLET_ID && network.walletId === METAMASK_WALLET_ID;

      // Mobile Chrome has no extension. Web3Modal opens a https://metamask.app.link/wc?… URL in the
      // same tab (_self); Android often offers "Chrome" which cannot finish WalletConnect — so nothing
      // happens. Opening via MetaMask's dapp link loads this site inside MetaMask (injected provider).
      if (isMobile() && noInjected && isMetaMaskRow) {
        const target = encodeURIComponent(window.location.href);
        window.location.href = `https://metamask.app.link/dapp/${target}`;
        toast("Opening MetaMask… Continue in the MetaMask app browser.", {
          icon: "👛",
          duration: 5000,
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
        return;
      }

      openWeb3Modal({ view: "ConnectWallet", walletId: network.walletId });

      toast("When your phone asks how to open the link, choose your wallet app (not Chrome).", {
        icon: "👛",
        duration: 6000,
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    } else {
      window.location.href = network?.deepLink;
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