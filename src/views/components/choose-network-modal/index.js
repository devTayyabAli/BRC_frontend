import React, { useState,forwardRef } from 'react';
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

const networks = [
  { name: 'Metamask', icon: <img style={{ width: "40px", height: "40px" }} src={`/images/pages/metamask.webp`}/>,deepLink:process.env.NEXT_PUBLIC_METAMASK_DEEP_LINK},
  { name: 'Trust Wallet', icon: <img style={{ width: "40px", height: "40px" }} src={`/images/pages/trust-wallet.jpg`}/>,deepLink:process.env.NEXT_PUBLIC_TRUST_DEEP_LINK },
  { name: 'Token Pocket Wallet', icon: <img style={{ width: "40px", height: "40px"  }} src={`/images/pages/token-pocket.webp`}/>,deepLink:process.env.NEXT_PUBLIC_TP_DEEP_LINK },
  // { name: 'Trust Wallet', icon: <img style={{ width: "40px", height: "40px"  }} src={`/images/pages/trust-wallet.jpg`}/> },
];


const NetworkSelector = ({ open, onClose }) => {

  const handleNetworkSelection = (network) => {
    window.open(network?.deepLink, '_blank');
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