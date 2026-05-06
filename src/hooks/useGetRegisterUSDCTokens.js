// ** WEB3 Imports
import { useState, useEffect } from "react";
import { useContractRead } from "wagmi";
import { ethers } from "ethers";
import { CONTRACT_INFO } from "src/contract";

const useGetRegisterUSDCTokens = (address) => {
  const [availableUSDC, setAvailableUSDC] = useState(null);

  //get one live kgc token rate
  const {
    data: usdc,
    isSuccess: isUSDCBlncFetched,
    refetch,
  } = useContractRead({
    address: CONTRACT_INFO.token.address,
    abi: CONTRACT_INFO.token.abi,
    functionName: "balanceOf",
    args: [address && address],
    enabled:!!address
  });

  useEffect(() => {
    if (usdc) {
      setAvailableUSDC(Number(ethers.utils.formatUnits(usdc || 0, "ether")));
    }
  }, [usdc]);

  return {
    availableUSDC,
    refetch,
    isUSDCBlncFetched,
  };
};

export default useGetRegisterUSDCTokens;
