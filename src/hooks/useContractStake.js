// ** WEB3 Imports
import { useState, useEffect } from "react";
import {
  useContractRead,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { ethers } from "ethers";
import { CONTRACT_INFO } from "src/contract";
import { toast } from "react-hot-toast";

const useContractStake = (tokensToFetch) => {
  //stale
  const [stakeLimit, setStakeLimit] = useState({ min: 0, max: 0 });

  //get stake limit
  const { data: maxAmount, isSuccess: isMaximumAmountFetched } = useContractRead({
    address: CONTRACT_INFO.main.address,
    abi: CONTRACT_INFO.main.abi,
    functionName: "maximumAmount",
    // args: [],
  });

  const { data: minAmount, isSuccess: isMinAmountFetched } = useContractRead({
    address: CONTRACT_INFO.main.address,
    abi: CONTRACT_INFO.main.abi,
    functionName: "minimumAmount",
    // args: [],
  });

  useEffect(() => {
    if (minAmount) {
      setStakeLimit((prevStakeLimit) => ({
        ...prevStakeLimit,
        min: Number(ethers.utils.formatUnits(minAmount || 0, "ether")),
      }));
    }

    if (maxAmount) {
      setStakeLimit((prevStakeLimit) => ({
        ...prevStakeLimit,
        max: Number(ethers.utils.formatUnits(maxAmount || 0, "ether")),
      }));
    }
  }, [minAmount, maxAmount]);

  //stake
  const {
    isError: isStakeSentError,
    error: stakeSentError,
    data: stakeSentTx,
    isLoading: isStakekgcSentTxInProgress,
    isSuccess: isAstakeKgcTxSent,
    write: stakeKgcTokens,
  } = useContractWrite({
    address: CONTRACT_INFO.main.address,
    abi: CONTRACT_INFO.main.abi,
    functionName: "stakeTokens",
  });
  const {
    isLoading: isStakekgcTxInProgress,
    isSuccess: isstakeCompleted,
    isError: isStakeError,
    error: stakeTxError,
  } = useWaitForTransaction({
    hash: stakeSentTx?.hash,
  });

  useEffect(() => {
    if (isStakeSentError) {
      toast.error(stakeSentError.name, {
        duration: 5000,
      });
    }
  }, [isStakeSentError]);

  useEffect(() => {
    if (isStakeError) {
      toast.error(stakeTxError.name, {
        duration: 5000,
      });
    }
  }, [isStakeError]);

  const calculateTokensAgainstLiveKGC = (liveRate, value) => {
    return Number(liveRate) * Number(value);
  };

  return {
    //stake
    stakeSentError,
    isStakeSentError,
    stakeSentTx,
    isStakekgcSentTxInProgress,
    isStakekgcTxInProgress,
    isAstakeKgcTxSent,
    stakeKgcTokens,
    isstakeCompleted,
    isStakeError,
    stakeTxError,

    //stake limit
    stakeLimit,

    // kgcToken
    calculateTokensAgainstLiveKGC,
  };
};
export default useContractStake;
