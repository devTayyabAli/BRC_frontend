// ** WEB3 Imports
import { useState, useEffect } from "react";
import { useContractRead } from "wagmi";
import { ethers } from "ethers";
import { CONTRACT_INFO } from "src/contract";

const useGetCurrentPrice = () => {
  const [kgcTokens, setKGCTokens] = useState(null);
  //get one live kgc token rate
  const {
    data: liveRate,
    isSuccess: isOneKgcTokenCompletedF,
    refetch,
  } = useContractRead({
    address: CONTRACT_INFO.main.address,
    abi: CONTRACT_INFO.main.abi,
    functionName: "currentBRCPrice",
  });
  useEffect(() => {
    if (liveRate) {
     
      setKGCTokens(ethers.utils.formatUnits(liveRate || 0, "ether"));
    }else {
      setKGCTokens(0)
    }
  }, [liveRate]);
  return {
    kgcTokens,
    refetch,
  };
};

export default useGetCurrentPrice;
