import { useContext, useEffect, useState } from "react";
// ** MUI Imports
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import LinearProgress from "@mui/material/LinearProgress";
import SocketContext from "src/context/Socket";
import { CardContent } from "@mui/material";
import { useSelector } from "react-redux";

const CappingStatus = (props) => {
  const { value, total, cappingFormula } = props;
  const percentageCompleted = Math.round((value / total) * 100);
  const percentageRemaining = 100 - percentageCompleted;

  return (
    <Card>
      <CardContent>
        <Typography sx={{ fontSize: 24, color: "", fontWeight: 700 }}>
          Capping Status ({cappingFormula}X)
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              my: 1.5,
            }}
          >
            <Box>{`${percentageCompleted}% earned`}</Box>
            <Box>{`${percentageRemaining}% remains`}</Box>
          </Box>
          <Box sx={{ width: "100%", mr: 1 }}>
            <LinearProgress
              variant="determinate"
              {...props}
            />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default function ProcessLinearWithLabel() {
  // ** State
  const currentUser = useSelector((state) => state?.getCurrentUser?.user?.data);
  const socket = useContext(SocketContext);
  const [progress, setProgress] = useState(0);
  const [cappingFormula, setCappingFormula] = useState(null);
  const totalProgress = 100;

  useEffect(() => {
    const handleCappingAmount = ({ cappingAmount, earnAmount, cappingFormula }) => {
      setCappingFormula(cappingFormula);
        let percentage = 0;
       if (cappingAmount > 0 ) {
        percentage=(earnAmount / cappingAmount) * 100;
       }
       if (percentage >= 100) {
      percentage = 100; 
      }
          setProgress(percentage);
    };

    if (socket && currentUser?._id) {
      socket.emit("capping", currentUser._id); // Emit capping event to server with userId
      socket.on("cappingAmount", handleCappingAmount); // Listen to cappingAmount event
    }

    return () => {
      if (socket && currentUser?._id) {
        socket.off("cappingAmount", handleCappingAmount); // Remove the listener when component unmounts
      }
    };
  }, [socket, currentUser?._id]);

  return (
    <CappingStatus
      value={progress}
      total={totalProgress}
      cappingFormula={cappingFormula}
    />
  );
}
