// ** WEB3 Imports
import { useState, useEffect } from "react";
import { useContractRead } from "wagmi";
import { ethers } from "ethers";
import { CONTRACT_INFO } from "src/contract";
export const useContractRegister = (address) => {
  const [tokenBlnc, setTokenBlnc] = useState(null);
  const { data, isSuccess, refetch } = useContractRead({
    address: CONTRACT_INFO.kgc.address,
    abi: CONTRACT_INFO.kgc.abi,
    functionName: "balanceOf",
    args: [address],
  });
  useEffect(() => {
    if (data) {
      setTokenBlnc(ethers.utils.formatUnits(data || 0, "ether"));
    }
  }, [data]);

  return { tokenBlnc: Number(tokenBlnc)<0.00001?0:Number(tokenBlnc), isSuccess, refetch };
};
