// ** Next Imports
import Head from "next/head";
import { Router } from "next/router";
import { useState, useEffect, useContext, forwardRef } from "react";
import authConfig from "src/configs/auth";

// ** Store Imports
import { store } from "src/store";
import { Provider } from "react-redux";

// ** Icon Imports
import Icon from "src/@core/components/icon";

// ** Loader Import
import NProgress from "nprogress";

// ** Emotion Imports
import { CacheProvider } from "@emotion/react";

// ** Config Imports
import "src/configs/i18n";
import { defaultACLObj } from "src/configs/acl";
import themeConfig from "src/configs/themeConfig";
import Confetti from "react-confetti";
import { AnimatePresence, motion } from "framer-motion";

// ** Fake-DB Import
import "src/@fake-db";

// ** Third Party Import
import { Toaster } from "react-hot-toast";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Fade from "@mui/material/Fade";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";

// ** Component Imports
import UserLayout from "src/layouts/UserLayout";
import AclGuard from "src/@core/components/auth/AclGuard";
import ThemeComponent from "src/@core/theme/ThemeComponent";
import AuthGuard from "src/@core/components/auth/AuthGuard";
import GuestGuard from "src/@core/components/auth/GuestGuard";

// ** Spinner Import
import Spinner from "src/@core/components/spinner";

// ** Contexts
import { AuthProvider } from "src/context/AuthContext";
import {
  SettingsConsumer,
  SettingsProvider,
} from "src/@core/context/settingsContext";
import SocketContext from "src/context/Socket";
import Socket from "src/configs/socket";

// ** Styled Components
import ReactHotToast from "src/@core/styles/libs/react-hot-toast";

// ** Utils Imports
import { createEmotionCache } from "src/@core/utils/create-emotion-cache";

// ** Web3 Imports
import { Web3Modal } from "src/context/Web3Modal";

// ** Prismjs Styles
import "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";

// ** React Perfect Scrollbar Style
import "react-perfect-scrollbar/dist/css/styles.css";
import "src/iconify-bundle/icons-bundle-react";

// ** Global css styles
import "../../styles/globals.css";
import isMobile from "is-mobile";
import { useRouter } from "next/router";
const clientSideEmotionCache = createEmotionCache();

// ** Pace Loader
if (themeConfig.routingLoader) {
  Router.events.on("routeChangeStart", () => {
    NProgress.start();
  });
  Router.events.on("routeChangeError", () => {
    NProgress.done();
  });
  Router.events.on("routeChangeComplete", () => {
    NProgress.done();
  });
}

const Transition = forwardRef(function Transition(props, ref) {
  return <Fade ref={ref} {...props} />;
});

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

const Guard = ({ children, authGuard, guestGuard }) => {
  if (guestGuard) {
    return <GuestGuard fallback={<Spinner />}>{children}</GuestGuard>;
  } else if (!guestGuard && !authGuard) {
    return <>{children}</>;
  } else {
    return <AuthGuard fallback={<Spinner />}>{children}</AuthGuard>;
  }
};

// ** Configure JSS & ClassName
const App = (props) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const [socket, setSocket] = useState(undefined);
  const [showPopup, setShowPopup] = useState(false);
  const [showTitle, setShowTitle] = useState("");
  const [showDescription, setShowDescription] = useState("");
  const [showRankPopup, setShowRankPopup] = useState(false);
  const [showRankTitle, setShowRankTitle] = useState("");
  const [showRankDescription, setShowRankDescription] = useState("");
  const [isConfettiActive, setIsConfettiActive] = useState(false);
  const router = useRouter();
  // Variables
  const contentHeightFixed = Component.contentHeightFixed ?? false;
  const user =
    typeof window !== "undefined"
      ? JSON?.parse(window?.localStorage?.getItem("userData"))
      : false;

  const getLayout =
    Component.getLayout ??
    ((page) => (
      <UserLayout contentHeightFixed={contentHeightFixed}>{page}</UserLayout>
    ));
  const setConfig = Component.setConfig ?? undefined;
  const authGuard = Component.authGuard ?? true;
  const guestGuard = Component.guestGuard ?? false;
  const aclAbilities = Component.acl ?? defaultACLObj;

  const handleClose = () => {
    setShowPopup(false);
    setShowTitle("");
    setShowDescription("");
  };
  useEffect(() => {
    if (showRankPopup === true) setIsConfettiActive(showRankPopup);
  }, [showRankPopup]);
  const handleRankClose = () => {
    setIsConfettiActive(false);
    setShowRankPopup(false);
    setShowRankTitle("");
    setShowRankDescription("");
  };

  
  useEffect(() => {
    if (!socket) {
      const connectedSocket = Socket.connectSocket();
      setSocket(connectedSocket);
    }
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    const handleCappingAmount = ({ cappingAmount, earnAmount }) => {
      let percentage = 0;
      if (cappingAmount) {
        percentage = (earnAmount / cappingAmount) * 100;
      }
      if (percentage >= 100) {
        setShowPopup(true);
        setShowTitle("Capping Limit Reached!");
        setShowDescription(
          "Your capping limit has been reached to 100%. Please stake again to continue receiving rewards."
        );
      }
    };
    if (socket && user?.data?._id) {
      socket.emit("capping", user.data._id);
      socket.on("cappingAmount", handleCappingAmount); // Listen to cappingAmount event
    }
    return () => {
      if (socket && user?.data?._id) {
        socket.off("cappingAmount", handleCappingAmount); // Remove the listener when component unmounts
      }
    };
  }, [socket, user?.data?._id]);

  useEffect(() => {
    const handleRankUpdate = ({ title, description }) => {
      setShowRankPopup(true);
      setShowRankTitle(title);
      setShowRankDescription(description);
    };
    if (socket) {
      socket.on("rankUpdationNotification", handleRankUpdate); // Listen to rankUpdation event
    }
    return () => {
      if (socket) {
        socket.off("rankUpdationNotification", handleRankUpdate); // Remove the listener when component unmounts
      }
    };
  }, [socket]);

  useEffect(() => {
    const handleLogout = () => {
      console.log('bannedUserSession-recieved');
      window.localStorage.removeItem(authConfig.storageUserDataKeyName);
      window.localStorage.removeItem(authConfig.storageTokenKeyName);
      router.push("/login");
    };

    if (socket && user?.data?._id) {
      socket.emit("bannedUser", user.data._id);
      socket.on("bannedUserSession", handleLogout); // Listen to bannedUserSession event
    }

    return () => {
      if (socket && user?.data?._id) {
        socket.off("bannedUserSession", handleLogout); // Remove the listener when component unmounts
      }
    };
  }, [socket, user?.data?._id]);

  useEffect(() => {
    const excludedPaths = ["/set-password/[token]", "/login", "/signup"];

    if (router && !excludedPaths.includes(router.pathname)) {
      if (isMobile() && !window?.ethereum) {
        router.push("/wallet-connection-error-guest");
      }
    }
  }, []);

  return (
    <>
      {/* Background Glowing Orbs for Glassmorphism UI */}
      <Box
        sx={{
          position: "fixed",
          top: "-10%",
          right: "-5%",
          width: "40vw",
          height: "40vw",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(201,168,76,0.15) 0%, rgba(0,0,0,0) 70%)",
          filter: "blur(100px)",
          zIndex: -1,
          // animation: "pulseOrbs 10s infinite alternate ease-in-out",
          // "@keyframes pulseOrbs": {
          //   "0%": { transform: "scale(1)", opacity: 0.8 },
          //   "100%": { transform: "scale(1.2)", opacity: 1 }
          // }
        }}
      />
      <Box
        sx={{
          position: "fixed",
          bottom: "-10%",
          left: "-5%",
          width: "50vw",
          height: "50vw",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(212,175,55,0.1) 0%, rgba(0,0,0,0) 70%)",
          filter: "blur(120px)",
          zIndex: -1,
          // animation: "pulseOrbs 15s infinite alternate-reverse ease-in-out"
        }}
      />

      <Web3Modal>
        <SocketContext.Provider value={socket}>
          <Provider store={store}>
            <CacheProvider value={emotionCache}>
              <Head>
                <title>{`${themeConfig.templateName} - BRC - King Global Community`}</title>
                <meta
                  name="description"
                  content={`${themeConfig.templateName} – BRC Token presents Defi, NFT, Gaming, Crypto, Expo, Crypto Webinars and utility payment services, all in one place with BRC Token economy.`}
                />
                <meta
                  name="keywords"
                  content="Material Design, MUI, Admin Template, React Admin Template"
                />
                <meta
                  name="viewport"
                  content="initial-scale=1, width=device-width"
                />
              </Head>
              <AuthProvider>
                <SettingsProvider
                  {...(setConfig ? { pageSettings: setConfig() } : {})}
                >
                  <SettingsConsumer>
                    {({ settings }) => {
                      return (
                        <ThemeComponent settings={settings}>
                          <Guard authGuard={authGuard} guestGuard={guestGuard}>
                            <AclGuard
                              aclAbilities={aclAbilities}
                              guestGuard={guestGuard}
                              authGuard={authGuard}
                            >

                              {getLayout(<Component {...pageProps} />)}

                            </AclGuard>
                          </Guard>
                          <ReactHotToast>
                            <Toaster
                              position={settings.toastPosition}
                              toastOptions={{ className: "react-hot-toast" }}
                            />
                          </ReactHotToast>
                        </ThemeComponent>
                      );
                    }}
                  </SettingsConsumer>
                </SettingsProvider>
              </AuthProvider>
              {/* Capping Status Notification */}
              <Dialog
                fullWidth
                open={showPopup}
                scroll="body"
                maxWidth="sm"
                onClose={() => handleClose()}
                TransitionComponent={Transition}
                onBackdropClick={() => handleClose()}
                sx={{
                  "& .MuiDialog-paper": {
                    overflow: "visible",
                    maxHeight: "280px",
                  },
                }}
              >
                <DialogContent
                  sx={{
                    px: (theme) => [
                      `${theme.spacing(5)} !important`,
                      `${theme.spacing(15)} !important`,
                    ],
                    py: (theme) => [
                      `${theme.spacing(8)} !important`,
                      `${theme.spacing(12.5)} !important`,
                    ],
                  }}
                >
                  <CustomCloseButton onClick={() => handleClose()}>
                    <Icon icon="tabler:x" fontSize="1.25rem" />
                  </CustomCloseButton>
                  <Box sx={{ mb: 4, textAlign: "center" }}>
                    <Typography variant="h5" sx={{ mb: 3 }}>
                      {showTitle}
                    </Typography>
                    <Typography sx={{ color: "text.secondary" }}>
                      {showDescription}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      mb: 4,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  ></Box>
                </DialogContent>
              </Dialog>
              {/* Rank Updation Notification */}
              <Dialog
                fullWidth
                open={showRankPopup}
                scroll="body"
                maxWidth="sm"
                onClose={() => handleRankClose()}
                TransitionComponent={Transition}
                onBackdropClick={() => handleRankClose()}
                sx={{
                  "& .MuiDialog-paper": {
                    overflow: "visible",
                    maxHeight: "280px",
                  },
                }}
              >
                <DialogContent
                  sx={{
                    px: (theme) => [
                      `${theme.spacing(5)} !important`,
                      `${theme.spacing(15)} !important`,
                    ],
                    py: (theme) => [
                      `${theme.spacing(8)} !important`,
                      `${theme.spacing(12.5)} !important`,
                    ],
                  }}
                >
                  <CustomCloseButton onClick={() => handleRankClose()}>
                    <Icon icon="tabler:x" fontSize="1.25rem" />
                  </CustomCloseButton>
                  <Box sx={{ mb: 4, textAlign: "center" }}>
                    <Typography variant="h5" sx={{ mb: 3 }}>
                      {showRankTitle}
                    </Typography>
                    <Typography sx={{ color: "text.secondary" }}>
                      {showRankDescription}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      mb: 4,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  ></Box>
                </DialogContent>
              </Dialog>
            </CacheProvider>
          </Provider>
        </SocketContext.Provider>
      </Web3Modal>
      {isConfettiActive && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 1200,
          }}
        >
          <Confetti
            width={1920}
            height={1200}
            numberOfPieces={400}
            recycle={true}
            opacity={0.8}
            gravity={0.3}
            run={isConfettiActive}
          />
        </div>
      )}
    </>
  );
};

export default App;
