import { useEffect } from "react";

// ** MUI Imports
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";

// ** Icon Imports
import Icon from "src/@core/components/icon";

// ** Components
import ModeToggler from "src/@core/layouts/components/shared-components/ModeToggler";
import UserDropdown from "src/@core/layouts/components/shared-components/UserDropdown";
// import LanguageDropdown from "src/@core/layouts/components/shared-components/LanguageDropdown";

// ** Hook Import
import { useAuth } from "src/hooks/useAuth";

// redux imports
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser } from "src/store/apps/auth/currentUserSlice";
import { Typography } from "@mui/material";
import { useRouter } from "next/router";

const AppBarContent = (props) => {
  // ** Props
  const { hidden, settings, saveSettings, toggleNavVisibility } = props;
  const router = useRouter();
  const { admin } = router.query;
  // ** Hook
  const auth = useAuth();

  const dispatch = useDispatch();
  const user = useSelector((state) => state?.login?.user?.data);

  useEffect(() => {
    if (admin) {
      dispatch(getCurrentUser(admin));
    } else {
      dispatch(getCurrentUser(user?._id));
    }
  }, [admin]);

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Box
        className="actions-left"
        sx={{ mr: 2, display: "flex", alignItems: "center" }}
      >

        {hidden && !settings.navHidden ? (
          <IconButton
            color="inherit"
            sx={{ ml: -2.75 }}
            onClick={toggleNavVisibility}
          >
            <Icon fontSize="1.5rem" icon="tabler:menu-2" />
          </IconButton>
        ) :
          null
        }
      </Box>
      <Box sx={{ fontWeight: "700", fontSize: "14px", display: "flex", justifyContent: "center", alignItems: 'center', gap: '10px', width: "100%" }}>
        {
          settings?.mode == "dark" ?
            <img src="/images/KGCNightLogo.png" width="170" height="auto" alt="brc-logo" />
            :
            <img src="/images/DayLogoKGC.png" width="170" height="auto" alt="brc-logo" />

        }
      </Box>
      <Box
        className="actions-right"
        sx={{ display: "flex", alignItems: "center" }}
      >
        {/* <LanguageDropdown settings={settings} saveSettings={saveSettings} /> */}
        <ModeToggler settings={settings} saveSettings={saveSettings} />
        {auth.user && (
          <>
            <UserDropdown settings={settings} />
          </>
        )}
      </Box>
    </Box>
  );
};

export default AppBarContent;
