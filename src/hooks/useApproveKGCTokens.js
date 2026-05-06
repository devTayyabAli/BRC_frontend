// ** WEB3 Imports
import { useContractWrite, useWaitForTransaction } from "wagmi";
import { CONTRACT_INFO } from "src/contract";
import { toast } from "react-hot-toast";
import { useEffect } from "react";

const useApproveKGCTokens = () => {
  //approve contract

  const {
    isError: isApproveSentError,
    data: approveSentTx,
    isLoading: isApprovekgcTxInProgress,
    isSuccess: isApproveKgcTxSent,
    write: approveKgcTokens,
    error: approveSentError,
  } = useContractWrite({
    address: CONTRACT_INFO.kgc.address,
    abi: CONTRACT_INFO.kgc.abi,
    functionName: "approve",
  });
  const {
    isLoading: isApprovalTokensWaiting,
    isSuccess: isApprovalCompleted,
    isError: isApprovalError,
    error: approvalTxError,
  } = useWaitForTransaction({
    hash: approveSentTx?.hash,
  });
  
  useEffect(() => {
    if (isApproveSentError) {
      toast.error(approveSentError.name, {
        duration: 5000,
      });
    }
  }, [isApproveSentError]);
  
  useEffect(() => {
    if (isApprovalError) {
      toast.error(approvalTxError.name, {
        duration: 5000,
      });
    }
  }, [isApprovalError]);

  return {
    //approve
    isApproveSentError,
    approveSentTx,
    isApprovekgcTxInProgress,
    isApproveKgcTxSent,
    approveKgcTokens,
    isApprovalCompleted,
    isApprovalError,
    isApprovalTokensWaiting,
    approveSentError,
    approvalTxError
  };
};

export default useApproveKGCTokens;
