// ** WEB3 Imports
import { useContractWrite, useWaitForTransaction } from "wagmi";
import { CONTRACT_INFO } from "src/contract";
const useContractWithdrawal = () => {
  //approve contract

  const {
    isError: isWithdrawSentError,
    data: withdrawSentTx,
    isLoading: isWithdrawUsdcTxInProgress,
    isSuccess: isWithdrawUsdcTxSent,
    write: withdrawFunds,
    error:withdrawSentError
  } = useContractWrite({
    address: CONTRACT_INFO.main.address,
    abi: CONTRACT_INFO.main.abi,
    functionName: "withdrawAmount",
  });
  const {
    isLoading: isWithdrawalTokensWaiting,
    isSuccess: isWithdrawalCompleted,
    isError: isWithdrawalError,
    error:withdrawTxError
  } = useWaitForTransaction({
    hash: withdrawSentTx?.hash,
  });

  return {
    //withdraw
    isWithdrawSentError,
    withdrawSentTx,
    isWithdrawUsdcTxInProgress,
    isWithdrawUsdcTxSent,
    withdrawFunds, // Renamed the function
    isWithdrawalCompleted,
    isWithdrawalError,
    isWithdrawalTokensWaiting,
    withdrawSentError,
    withdrawTxError
  };
};

export default useContractWithdrawal;
