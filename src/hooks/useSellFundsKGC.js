// ** WEB3 Imports
import { useContractWrite, useWaitForTransaction } from "wagmi";
import { CONTRACT_INFO } from "src/contract";
const useSellFundsKGC = () => {
  //approve contract

  const {
    isError: isSellFundsSentError,
    data: sellFundsSentTx,
    isLoading: isSellFundsUsdcTxInProgress,
    isSuccess: isSellFundsUsdcTxSent,
    write: sellFundsKGC, // Renamed the function
    error: sellFundsSentError
  } = useContractWrite({
    address: CONTRACT_INFO.main.address,
    abi: CONTRACT_INFO.main.abi,
    functionName: "sellBRC",
  });
  const {
    isLoading: isSellFundsTokensWaiting,
    isSuccess: isSellFundsCompleted,
    isError: isSellFundsError,
    error: sellFundsTxError
  } = useWaitForTransaction({
    hash: sellFundsSentTx?.hash,
  });

  return {
    //sellFunds
    isSellFundsSentError,
    sellFundsSentTx,
    isSellFundsUsdcTxInProgress,
    isSellFundsUsdcTxSent,
    sellFundsKGC, // Renamed the function
    isSellFundsCompleted,
    isSellFundsError,
    isSellFundsTokensWaiting,
    sellFundsSentError,
    sellFundsTxError
  };
};

export default useSellFundsKGC;
