// ** WEB3 Imports
import { useContractWrite, useWaitForTransaction } from "wagmi";
import { CONTRACT_INFO } from "src/contract";
const useBuyFundsKGC = () => {
  //approve contract

  const {
    isError: isBuyFundsSentError,
    data: buyFundsSentTx,
    isLoading: isBuyFundsUsdcSentTxInProgress,
    isSuccess: isBuyFundsUsdcTxSent,
    write: buyFundsKGC, // Renamed the function
    error: buyFundsSentError
  } = useContractWrite({
    address: CONTRACT_INFO.main.address,
    abi: CONTRACT_INFO.main.abi,
    functionName: "buyBRC",
  });
  const {
    isLoading: isBuyFundsTokensWaiting,
    isSuccess: isBuyFundsCompleted,
    isError: isBuyFundsError,
    error: buyFundsTxError
  } = useWaitForTransaction({
    hash: buyFundsSentTx?.hash,
  });

  return {
    //buyFunds
    isBuyFundsSentError,
    buyFundsSentTx,
    isBuyFundsUsdcSentTxInProgress,
    isBuyFundsUsdcTxSent,
    buyFundsKGC, // Renamed the function
    isBuyFundsCompleted,
    isBuyFundsError,
    isBuyFundsTokensWaiting,
    buyFundsSentError,
    buyFundsTxError
  };
};

export default useBuyFundsKGC;
