// ** WEB3 Imports
import { useState, useEffect } from "react";
import { useContractRead } from "wagmi";
import { ethers } from "ethers";
import { CONTRACT_INFO } from "src/contract";
import { formatNumber, toFixedDecimal } from "src/constants/common";
const useReadSakeLimitInUSDC = (minKgc,maxKgc) => {
  const [stakeLimitInUSDC, setStakeLimitInUSDC] = useState({min:0,max:0});
  const { data:minUSDC, isSuccess:isMinUSDCSuccess, refetch:refetchMinUSDC } = useContractRead({
    address: CONTRACT_INFO.main.address,
    abi: CONTRACT_INFO.main.abi,
    functionName: "getBRCPrice",
    args: [ethers.utils.parseEther(`${minKgc}`|| 0)],
    enabled:!!minKgc
  });
  const { data:maxUSDC, isSuccess:isMaxUSDCSuccess, refetch:refetchMaxUSDC } = useContractRead({
    address: CONTRACT_INFO.main.address,
    abi: CONTRACT_INFO.main.abi,
    functionName: "getBRCPrice",
    args: [ethers.utils.parseEther(`${maxKgc}`|| 0)],
    enabled:!!maxKgc
  });
useEffect(() => {
  if (minUSDC) {
    setStakeLimitInUSDC(prevState => ({
      ...prevState,
      min: Number(formatNumber(Number(ethers?.utils?.formatUnits(minUSDC || 0, "ether")), toFixedDecimal))
    }));
  }
}, [minUSDC]);

useEffect(() => {
  if (maxUSDC) {
    setStakeLimitInUSDC(prevState => ({
      ...prevState,
      max: Number(formatNumber(Number(ethers?.utils?.formatUnits(maxUSDC || 0, "ether")), toFixedDecimal))
    }));
  }
}, [maxUSDC]);

  return { stakeLimitInUSDC, refetchMinUSDC,isMaxUSDCSuccess,refetchMaxUSDC };
};

export default useReadSakeLimitInUSDC;
