// ** WEB3 Imports
import { useState, useEffect } from "react";
import { useContractRead } from "wagmi";
import { ethers } from "ethers";
import { CONTRACT_INFO } from "src/contract";
import { formatNumber, toFixedDecimal } from "src/constants/common";
const useGetMinWithdrawalAmountInKgc = () => {
  const [minWithdrawalAmountInKgc, setMinWithdrawalAmountInKgc] = useState(0);
  const [minWithdrawalAmountInUSDC, setMinWithdrawalAmountUSDC] = useState(0);

  const {
    data: minWithdrawalKgc,
    isSuccess: isMinWithdrawalKgc,
    refetch: refetchMinKGC,
  } = useContractRead({
    address: CONTRACT_INFO.main.address,
    abi: CONTRACT_INFO.main.abi,
    functionName: "minimumWithdrawAmount",
  });
  const {
    data: minWithdrawalUSDC,
    isSuccess: isMinWithdrawalUSDC,
    isFetched:isMinWithdrawalUsdcFetched,
    refetch: refetchMinUSDC,
    error
  } = useContractRead({
    address: CONTRACT_INFO.main.address,
    abi: CONTRACT_INFO.main.abi,
    functionName: "getBRCPrice",
    args: [
      minWithdrawalKgc 
    ],
    enabled: !!minWithdrawalKgc,
  });
  useEffect(() => {
    if (minWithdrawalKgc) {
      setMinWithdrawalAmountInKgc(
        Number(
          formatNumber(
            Number(ethers?.utils?.formatUnits(minWithdrawalKgc || 0, "ether")),
            toFixedDecimal
          )
        )
      );
      refetchMinUSDC();
    }
  }, [minWithdrawalKgc]);
  useEffect(() => {
    if (minWithdrawalUSDC) {
      setMinWithdrawalAmountUSDC(
        Number(
          formatNumber(
            Number(ethers?.utils?.formatUnits(minWithdrawalUSDC || 0, "ether")),
            toFixedDecimal
          )
        )
      );
    }
  }, [minWithdrawalUSDC]);

  return {
    minWithdrawalAmountInKgc,
    minWithdrawalAmountInUSDC,
    isMinWithdrawalKgc,
    refetchMinKGC,
    isMinWithdrawalUSDC,
    refetchMinUSDC,
    isMinWithdrawalUsdcFetched
  };
};

export default useGetMinWithdrawalAmountInKgc;
