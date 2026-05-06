import { Box } from "@mui/material";
import Icon from "src/@core/components/icon";

export function capitalizeFirstLetter(str) {
  return str?.charAt(0)?.toUpperCase() + str?.slice(1)?.toLowerCase();
}
export function capitalizeEachWord(str) {
  return str?.split(' ')?.map(word => word?.charAt(0)?.toUpperCase() + word?.slice(1))?.join(' ');
}
export const formatNumber = (value, decimals) => {
  return Number(value)?.toFixed(decimals);
};
export const kgcToUSDC = (kgc, oneUSDC) => {
  const result = Number(kgc) * Number(oneUSDC);
  return formatNumber(result, toFixedDecimal);
};
export const findHighestRankTillSeven = (array) => {
  let highestNumber = -Infinity;
  for (let i = 0; i < array?.length; i++) {
    if (array[i] <= 7 && array[i] > highestNumber) {
        highestNumber = array[i];
    }
  }
  return highestNumber;
}
export const renderStars = (current, total) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
      {Array?.from({ length: total }, (_, index) => (
        <Icon
          key={index}
          icon={index < current ? "bi:star-fill" : "bi:star"}
          fontSize={18}
          color={"#C9A84C"}
        />
      ))}
    </Box>
  );
};
export const ReconnectKycStatus= ["rejected", "blocked","deleted"]
export const kycStatus = {
  "created": "Pending",
   "waiting":"Waiting",
  "inreview": "In-Review",
  "rejected": "Rejected",
  "approved": "Approved",
  "readyToReview": "Ready-To-Review",
  "blocked": "Blocked",
  "deleted": "Deleted",
};
export const toFixedDecimal = 4;
export const  truncateDecimals=(number, digits)=> {
  const power = Math.pow(10, digits);
  return Math.floor(number * power) / power;
}


export const PriorityArray=[
  {
    label:"Select Priority",
    value:"default"
  },
  {
    label:"Low (Login, Registration)",
    value:"Low"
  },
  {
    label:"Medium (Level Un-Lock, Bonus issue)",
    value:"Medium"
  },
  {
    label:"Critical Error (Withdrawal,Staking issue)",
    value:"Critical Error"
  }
]


export const AgentArray = [
  {
      title: "Monday",
  },
  {
      title: "Tuesday",
  },
  {
      title: "Wednesday",
  },
  {
      title: "Thursday",
  },
  {
      title: "Friday",
  },
  // {
  //     title: "Saturday",
  // },
]