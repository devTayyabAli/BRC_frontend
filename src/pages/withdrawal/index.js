// ** MUI Imports
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";

// **React Imports
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useContext } from "react";

// ** Custom Component Import
import CustomTextField from "src/@core/components/mui/text-field";
import { useAccount } from "wagmi";

// ** Redux Imports
import {
  fundsWithdrawal,
  fundsWithdrawalAmount,
} from "src/store/apps/withdrawal/withdrawalSlice";
import { completeFundsWithdrawal } from "src/store/apps/withdrawal/completeWithdrawalSlice";
import { completeWithdraw } from "src/store/apps/transaction/completeTransactionEvents";
// ** Web3 imports
import useContractWithdrawal from "src/hooks/useContractWithdrawal";
import { ethers } from "ethers";
import useGetKGCLiveTokens from "src/hooks/useGetKGCLiveTokens";
import { useSwitchNetwork } from "wagmi";
import useValidateAccount from "src/hooks/useValidateAccount";
// ** socket Imports
import SocketContext from "src/context/Socket";
import { toast } from "react-hot-toast";
import useGetUSDCTokens from "src/hooks/useGetUSDCTokens";
import { ENV } from "src/configs/env";
import { createTxLog } from "src/store/apps/transaction/transactionLogsSlice";
import useGetMinWithdrawalAmountInKgc from "src/hooks/useGetMinWithdrawalAmountInKgc";

const Withdrawal = () => {
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [error, setError] = useState(false);
  const [userId, setUserId] = useState(null);
  const [loader, setLoader] = useState(false);
  const user = useSelector((state) => state?.getCurrentUser?.user);
  const { address } = useAccount();
  const dispatch = useDispatch();
  const { data } = useSelector(
    (state) => state?.withdrawal?.fundsWithdrawalAmount || {}
  );
  const { fundsWithdrawal: withdrawResp } = useSelector(
    (state) => state.withdrawal
  );

  const socket = useContext(SocketContext);
  const { accError, chainError, chain } = useValidateAccount();
  const { switchNetwork } = useSwitchNetwork({
    onSuccess(data) {
      withdrawAmount();
    },
  });
  const {
    withdrawFunds,
    withdrawSentTx,
    isWithdrawUsdcTxInProgress,
    isWithdrawUsdcTxSent,
    isWithdrawalCompleted,
    isWithdrawalTokensWaiting,
    isWithdrawSentError,
    isWithdrawalError,
    withdrawSentError,
    withdrawTxError,
  } = useContractWithdrawal(setLoader);
  const { tokenBlnc: totalStakedAmountInUSDC, isSuccess, } = useGetUSDCTokens(
    data?.combinedTotalAmount
  );
  const { kgcTokens: withdrawalAmountInKgc } =
    useGetKGCLiveTokens(withdrawalAmount);
  const { minWithdrawalAmountInKgc, minWithdrawalAmountInUSDC, isMinWithdrawalUsdcFetched } =
    useGetMinWithdrawalAmountInKgc();
  useEffect(() => {
    if (isSuccess && isMinWithdrawalUsdcFetched && totalStakedAmountInUSDC > 0 && (totalStakedAmountInUSDC < minWithdrawalAmountInUSDC)) {
      setError(`Minimum withdrawal allowed=${minWithdrawalAmountInUSDC || 0}`);
    } else {
      setError(false);
    }

  }, [isSuccess, totalStakedAmountInUSDC, minWithdrawalAmountInUSDC])
  useEffect(() => {
    if (isWithdrawSentError || isWithdrawalError) {
      const error = withdrawSentError || withdrawTxError;
      // if (withdrawSentTx?.hash) {
      dispatch(
        createTxLog({
          walletAddress: address,
          ...(withdrawSentTx?.hash && { txHash: withdrawSentTx?.hash }),
          error: JSON.stringify(error?.message),
        })
      );
      toast.error(error.message, {
        duration: 2000,
      });
      // }
      setLoader(false);
    }
  }, [isWithdrawSentError, isWithdrawalError]);
  useEffect(() => {
    if (userId) {
      dispatch(fundsWithdrawalAmount(userId));
    }
  }, [userId]);

  useEffect(() => {
    if (isWithdrawalError) {
      toast.error(withdrawTxError.message, {
        duration: 2000,
      });
    }
  }, [isWithdrawalError]);
  useEffect(() => {
    if (isWithdrawalCompleted) {
      dispatch(completeWithdraw(withdrawSentTx?.hash));
    }
  }, [isWithdrawalCompleted]);

  const roundAmount = (amountInKgc) => {
    if (
      Number(amountInKgc) < minWithdrawalAmountInKgc &&
      Number(withdrawalAmount) >= minWithdrawalAmountInUSDC
    ) {
      return minWithdrawalAmountInKgc;
    }
    return amountInKgc;
  };

  function truncateDecimals(number, digits) {
    const power = Math.pow(10, digits);
    return Math.floor(number * power) / power;
  }
  const withdrawAmount = async () => {
    try {
      setLoader(true);
      // Dispatch the stakeKgc async thunk
      const response = await dispatch(
        fundsWithdrawal({
          userId,
          amount: Number(withdrawalAmountInKgc),
        })
      );
      if (response?.meta?.requestStatus === "fulfilled") {
        const withdrawalAmountFromContract =
          response?.payload?.data?.withdrawalAmountFromContract;
        if (withdrawalAmountFromContract) {
          let amount = 0
          if (withdrawalAmountFromContract > data?.stakingAmount) {
            amount = data?.stakingAmount
          } else {
            amount = withdrawalAmountFromContract
          }
          withdrawFunds({
            args: [
              Number(ethers.utils.parseEther(
                `${truncateDecimals(amount, 7)}`
              ))
            ],
            from: address,
          });
        }
        return;
      }
      setLoader(false);
    } catch (error) {
      setLoader(false);
      console.error("Error while withdraw the amount!", error.message);
    }
  };
  const handleSubmit = async () => {
    if (chain?.id !== ENV.chainId) {
      return switchNetwork?.(ENV.chainId);
    }
    withdrawAmount();
  };
  useEffect(() => {
    if (withdrawSentTx?.hash) {
      dispatch(
        completeFundsWithdrawal({
          id: withdrawResp.data._id,
          data: {
            txHash: withdrawSentTx?.hash,
            userId,
            fiatAmount: withdrawalAmount,
            cryptoAmount: Number(withdrawalAmountInKgc),
          },
        })
      );
    }
  }, [withdrawSentTx?.hash]);
  useEffect(() => {
    if (user) {
      setUserId(user?.data?._id);
    }
  }, [user]);

  useEffect(() => {
    if (socket && userId) {
      socket.emit("join", userId); // replace userId
      const handleWithdrawal = ({ }) => {
        toast.success("Tokens Withdrawal Successfully done!", {
          duration: 2000,
        });
        setWithdrawalAmount("");
        setLoader(false);
        dispatch(fundsWithdrawalAmount(userId));
      };

      socket.on("Withdraw", handleWithdrawal);

      return () => {
        socket.off("Withdraw", handleWithdrawal); // Remove the event listener
        socket.emit("leave", userId); // replace userId
      };
    }
  }, [socket, userId]);

  useEffect(() => {
    if (socket && userId) {
      const handleWithdrawAmount = ({ }) => {
        if (userId) {
          dispatch(fundsWithdrawalAmount(userId));
        }
      };

      socket.on("withdrawAmount", handleWithdrawAmount);

      return () => {
        socket.off("withdrawAmount", handleWithdrawAmount); // Remove the event listener
        socket.emit("withdrawAmount", userId); // replace userId
      };
    }
  }, [socket, userId]);
  useEffect(() => {
    if (user?.data?.isWithdrawInactive === true) {
      setError(`We're experiencing a technical issue. Our team is currently working to resolve it.`);
    } else if (user?.data?.totalStakeAmount < 50) {
      setError(`withdrawal unavailable`);
    }
  }, [totalStakedAmountInUSDC, withdrawalAmount])
  return (
    <Card sx={{ p: 8 }}>
      <Card sx={{ border: 1 }}>
        <CardHeader
          sx={{ textAlign: "center", py: 8, fontSize: 24 }}
          title={`Available Balance : $${totalStakedAmountInUSDC || 0}`}
        />
        <Divider sx={{ m: "0 !important" }} />
        <form onSubmit={(e) => e.preventDefault()}>
          <CardContent>
            <Grid container spacing={5}>
              <Grid item xs={12}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Enter Amount ($)*
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <CustomTextField
                  fullWidth
                  label=""
                  placeholder="Enter Withdrawal amount ($)"
                  onChange={(e) => {
                    let value = e?.target?.value;

                    // Remove leading zeros
                    value = value?.replace(/^0+(?=\d)/, '');

                    // Replace multiple consecutive dots with a single dot
                    value = value?.replace(/(\.[^.]*\.)+/g, '.');

                    // Restrict to only one dot
                    value = value?.replace(/(\..*)\./g, '$1');

                    // Restrict to only two decimal places
                    const parts = value?.split('.');
                    if (parts?.length > 1) {
                      value = `${parts[0]}.${parts[1]?.slice(0, 10)}`;
                    }
                    if (value == 0.0000001) {
                      return;
                    }
                    const blncError = +value > totalStakedAmountInUSDC
                    const minWithDarwalLimitError = +value < minWithdrawalAmountInUSDC
                    if (blncError) {
                      return setError(`Available balance is ${totalStakedAmountInUSDC || 0}`);
                    } else {
                      setError(false);
                    }
                    if (user?.data?.isWithdrawInactive === true) {
                      setError(`We're experiencing a technical issue. Our team is currently working to resolve it.`);
                    }
                    if (minWithDarwalLimitError) {
                      setError(`Minimum withdrawal allowed=${minWithdrawalAmountInUSDC || 0}`);
                    }
                    if (user?.data?.totalStakeAmount < 50) {
                      setError(`Withdrawal unavailable`);
                    }
                    setWithdrawalAmount(value);
                  }}
                  value={withdrawalAmount}
                  onKeyPress={(e) => {
                    if (
                      !/^\d*\.?\d*$/.test(e.key) &&
                      e.key !== "Backspace" &&
                      e.key !== "Delete"
                    ) {
                      e.preventDefault();
                    }
                  }}
                />
              </Grid>
              {error && (
                <Typography
                  variant="body2"
                  style={{ color: "#C9A84C" }}
                  sx={{ fontWeight: 600, marginLeft: "1.5rem" }}
                >
                  {error}
                </Typography>
              )}
            </Grid>
            {/* <Box sx={{ mt: 4 }}>
              <Typography variant="p" sx={{ color: "#C9A84C", fontSize: 13 }}>
                Note : Minimum Withdrawal $20 or above, multiple of 10$.
              </Typography>
            </Box>
            <Typography variant="p" sx={{ color: "#C9A84C", fontSize: 13 }}>
              Note : Deduction 5% on every Withdrawal
            </Typography> */}
          </CardContent>
          <Divider sx={{ m: "0 !important" }} />
          <CardActions>
            <Button
              fullWidth
              type="submit"
              sx={{ mr: 2 }}
              variant="contained"
              onClick={handleSubmit}
              disabled={
                isWithdrawUsdcTxInProgress ||
                isWithdrawalTokensWaiting ||
                !withdrawalAmount ||
                error ||
                loader ||
                accError
              }
            >
              {
                user?.data?.totalStakeAmount < 50 ?
                  "Withdrawal unavailable" :
                  accError
                    ? `Please connect with ${user?.data?.walletAddress?.slice(0, 6) +
                    "..." +
                    user?.data?.walletAddress?.slice(-6)
                    } wallet address`
                    : isWithdrawUsdcTxInProgress
                      ? "Approve Transaction!"
                      : isWithdrawalTokensWaiting || loader
                        ? "Transaction is in Progress, Please Wait!"
                        : "Submit"}
            </Button>
          </CardActions>
        </form>
      </Card>
    </Card>
  );
};

export default Withdrawal;
