// ** WEB3 Imports
import { useState, useEffect } from "react";
import {
  useContractRead,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { CONTRACT_INFO } from "src/contract";
import { toast } from "react-hot-toast";

const useContractFundTransfer = () => {
  //fundTransfer
  const {
    isError: isTransferSentError,
    data: transferSentTx,
    isLoading: isTransferkgcSentTxInProgress,
    isSuccess: isTransferKgcTxSent,
    write: transferKgcTokens,
    error: transferSentError,
  } = useContractWrite({
    address: CONTRACT_INFO.main.address,
    abi: CONTRACT_INFO.main.abi,
    functionName: "sendBRC",
  });

  const {
    isLoading: isTransferkgcTxInProgress,
    isSuccess: isTransferCompleted,
    isError: isTransferError,
    error: transferTxError,
  } = useWaitForTransaction({
    hash: transferSentTx?.hash,
  });

  useEffect(() => {
    if (isTransferSentError) {
      toast.error(transferSentError.name, {
        duration: 5000,
      });
    }
  }, [isTransferSentError]);

  useEffect(() => {
    if (isTransferError) {
      toast.error(transferTxError.name, {
        duration: 5000,
      });
    }
  }, [isTransferError]);

  return {
    //fundTransfer
    isTransferSentError,
    transferSentError,
    transferSentTx,
    isTransferkgcSentTxInProgress,
    isTransferkgcTxInProgress,
    isTransferKgcTxSent,
    transferKgcTokens,
    isTransferCompleted,
    isTransferError,
    transferTxError
  };
};
export default useContractFundTransfer;
