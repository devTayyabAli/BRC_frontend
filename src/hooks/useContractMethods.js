// ** WEB3 Imports
import { useState, useEffect } from "react";
import {
  useContractRead,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { ethers } from "ethers";
import { CONTRACT_INFO } from "src/contract";

const useContractMethods = (tokensToFetch) => {
  //stale
  const [oneKgcTokenRate, setOneKgcTokenRate] = useState(null);


  //get one live kgc token rate
  const { data: onekgcToken, isSuccess: isOneKgcTokenCompletedF } =
    useContractRead({
      address: CONTRACT_INFO.main.address,
      abi: CONTRACT_INFO.main.abi,
      functionName: "getBRCPrice",
      args: [1000000000000000000],
    });

  useEffect(() => {
    if (onekgcToken) {
      setOneKgcTokenRate(
        Number(ethers.utils.formatUnits(onekgcToken || 0, "ether"))
      );
    }
  }, [onekgcToken]);

  //approve contract

  const {
    isError: approveSentError,
    data: approveSentTx,
    isLoading: isApproveSentkgcTxInProgress,
    isSuccess: isApproveKgcTxSent,
    write: approveKgcTokens,
  } = useContractWrite({
    address: CONTRACT_INFO?.kgc?.address,
    abi: CONTRACT_INFO?.kgc?.abi,
    functionName: "approve",
  });

  const {
    isLoading: isApprovekgcTxInProgress,
    isSuccess: isApprovalCompleted,
    isError: isApprovalError,
  } = useWaitForTransaction({
    hash: approveSentTx?.hash,
  });

  const calculateTokensAgainstLiveKGC = (liveRate, value) => {
    return Number(liveRate) * Number(value);
  };

  return {
    //approve
    approveSentError,
    approveSentTx,
    isApproveSentkgcTxInProgress,
    isApproveKgcTxSent,
    approveKgcTokens,
    isApprovalCompleted,
    isApprovalError,
    isApprovekgcTxInProgress,

    // kgcToken
    oneKgcTokenRate,
    calculateTokensAgainstLiveKGC,
  };
};
export default useContractMethods;
