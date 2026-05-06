// ** WEB3 Imports
import { useState, useEffect } from "react";
import { useContractRead } from "wagmi";
import { ethers } from "ethers";
import { CONTRACT_INFO } from "src/contract";
import { formatNumber, toFixedDecimal } from "src/constants/common";
const useGetUSDTAmount = (address) => {
  const [tokenBlnc, setTokenBlnc] = useState(null);
  const { data,isFetched, refetch } = useContractRead({
    address: CONTRACT_INFO.token.address,
    abi: CONTRACT_INFO.token.abi,
    functionName: "balanceOf",
    args: [address]
  });
  useEffect(() => {
    if (data||isFetched) {
      setTokenBlnc(ethers?.utils?.formatUnits(data || 0, "ether"));
    }
  }, [data]);

  return { tokenBlnc: tokenBlnc, isSuccess:isFetched, refetch };
};

export default useGetUSDTAmount;
