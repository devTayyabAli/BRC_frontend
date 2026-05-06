// ** React Imports
import { useState } from "react";

// ** MUI Imports
import Tab from "@mui/material/Tab";
import TabPanel from "@mui/lab/TabPanel";
import TabContext from "@mui/lab/TabContext";
import { styled } from "@mui/material/styles";
import MuiTabList from "@mui/lab/TabList";
import MyProfile from "../MyProfile";
import EditProfile from "./EditProfile";
import ChangePassword from "../ChangePassword";

// Styled TabList component
const TabList = styled(MuiTabList)(({ theme }) => ({
  borderBottom: "0 !important",
  "&, & .MuiTabs-scroller": {
    boxSizing: "content-box",
    padding: theme.spacing(1.25, 1.25, 2),
    margin: theme.spacing(-1.25, -1.25, -2),
  },
  "& .MuiTabs-indicator": {
    display: "none",
  },
  "& .Mui-selected": {
    boxShadow: theme.shadows[2],
    backgroundColor: theme.palette.primary.main,
    color: "#fff !important",
  },
  "& .MuiTab-root": {
    lineHeight: 1,
    borderRadius: theme.shape.borderRadius,
    "&:hover": {
      color: "#fff",
    },
  },
}));

const ProfileTabs = () => {
  // ** State
  const [value, setValue] = useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <TabContext value={value}>
      <TabList onChange={handleChange} aria-label="customized tabs example">
        <Tab value="1" label="My Profile" />
        <Tab value="2" label="Edit Profile" />
        <Tab value="3" label="Change Password" />
      </TabList>
      <TabPanel value="1">
        <MyProfile />
      </TabPanel>
      <TabPanel value="2">
        <EditProfile />
      </TabPanel>
      <TabPanel value="3">
        <ChangePassword />
      </TabPanel>
    </TabContext>
  );
};

export default ProfileTabs;
