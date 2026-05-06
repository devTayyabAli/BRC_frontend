// ** WEB3 Imports
import { useState, useEffect } from "react";
import { useContractRead } from "wagmi";
import { ethers } from "ethers";
import { CONTRACT_INFO } from "src/contract";

const useGetKGCLiveTokens = (usdcTokens) => {
  const [kgcTokens, setKGCTokens] = useState(null);
  //get one live kgc token rate
  const {
    data: liveRate,
    isSuccess: isOneKgcTokenCompletedF,
    refetch,
  } = useContractRead({
    address: CONTRACT_INFO.main.address,
    abi: CONTRACT_INFO.main.abi,
    functionName: "getBRCAmount",
    args: [usdcTokens && ethers.utils.parseEther(`${usdcTokens || 0}`)],
    enabled:!!usdcTokens
  });
  useEffect(() => {
    if (liveRate) {
     
      setKGCTokens(ethers.utils.formatUnits(liveRate || 0, "ether"));
    }else if(!usdcTokens){
      setKGCTokens(0)
    }else {
      setKGCTokens(kgcTokens)
    }
  }, [liveRate]);
  return {
    kgcTokens,
    refetch,
  };
};

export default useGetKGCLiveTokens;
