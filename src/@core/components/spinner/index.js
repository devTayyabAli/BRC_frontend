// ** MUI Imports
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

const FallbackSpinner = ({ sx }) => {
  // ** Hook
  const theme = useTheme();

  const imageSource = "pre-loader-new";

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "center",
        ...sx,
      }}
    >
      <img
        src={`/images/pages/${imageSource}.png`}
        alt="loader"
        className="rotate"
        style={{
          width: "100px",
          height: "100px",
        }}
      />

      <CircularProgress style={{ display: "none" }} disableShrink sx={{ mt: 6 }} />
    </Box>
  );
};

export default FallbackSpinner;
