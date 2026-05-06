// **
import { useContext } from "react";

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

// ** Custom Component Import
import CustomTextField from "src/@core/components/mui/text-field";
import { useEffect, useState } from "react";
import { useContractRegister } from "src/hooks/useContractRegister";
import { useAccount } from "wagmi";
import { useDispatch, useSelector } from "react-redux";
import { stakeKGC } from "src/store/apps/stake/stakeSlice";
import { completeStakekGC } from "src/store/apps/stake/completeStakeSlice";
import {
  availableToConvert,
  completeSellFundEvent,
  completeStack,
} from "src/store/apps/transaction/completeTransactionEvents";
import { createTxLog } from "src/store/apps/transaction/transactionLogsSlice";

import { toast } from "react-hot-toast";

//web3
import useContractStake from "../../hooks/useContractStake";
import { CONTRACT_INFO } from "src/contract";
import { ethers } from "ethers";
import { useSwitchNetwork } from "wagmi";

// ** socket Imports
import SocketContext from "src/context/Socket";
import useGetKGCLiveTokens from "src/hooks/useGetKGCLiveTokens";
import useApproveKGCTokens from "src/hooks/useApproveKGCTokens";
import useGetUSDCTokens from "src/hooks/useGetUSDCTokens";
import useValidateAccount from "src/hooks/useValidateAccount";
import { ENV } from "src/configs/env";
import { formatNumber, toFixedDecimal } from "src/constants/common";
import useReadSakeLimitInUSDC from "src/hooks/useReadSakeLimitInUSDC";
import useSellFundsKGC from "src/hooks/useSellFundsKGC";
import {
  completeSellFund,
  sellFund,
} from "src/store/apps/transaction/transactionSlice";
import useGetCurrentPrice from "src/hooks/useGetCurrentPrice";
import { el } from "date-fns/locale";
const SellFunds = () => {
  const { address } = useAccount();
  const dispatch = useDispatch();
  const user = useSelector((state) => state?.login?.user);
  const { user: userData } = useSelector((state) => state?.getCurrentUser);
  const selectAvailableAmountToConvert = useSelector((state) => state?.completeTransactionEvents?.availableAmountToConvert?.availableAmountToConvert);


  const { accError, chainError, chain } = useValidateAccount();
  const { stake } = useSelector((state) => state.stake);

  const [userId, setUserId] = useState(null);
  const [sellAmount, setSellAmount] = useState(null);
  const [contribution, setContribution] = useState(true);
  const [kgcAmount, setKGCAmount] = useState(0);
  const [sellRecord, setSellRecord] = useState(null);

  const [error, setError] = useState(null);
  const { switchNetwork } = useSwitchNetwork({
    onSuccess(data) {
      handleSellFunds();
    },
  });

  const {
    tokenBlnc: availableKGC,
    refetch: refetchKGCTokens,
    isSuccess: isFetchedKGC,
  } = useContractRegister(address);

  const {
    tokenBlnc: sellAmountInUSDC,
    isSuccess: isFetchedUSDC,
    refetch: refetchUSDCTokens,
  } = useGetUSDCTokens(sellAmount);

  //sockets
  const socket = useContext(SocketContext);
  const {
    approveKgcTokens,
    isApprovalCompleted,
    isApprovekgcTxInProgress,
    isApprovalTokensWaiting,
    isApproveSentError,
    approveSentError,
    isApprovalError,
    approvalTxError,
  } = useApproveKGCTokens();

  const {
    isSellFundsSentError,
    sellFundsSentTx,
    isSellFundsUsdcTxInProgress,
    isSellFundsUsdcTxSent,
    sellFundsKGC, // Renamed the function
    isSellFundsCompleted,
    isSellFundsError,
    isSellFundsTokensWaiting,
    sellFundsSentError,
    sellFundsTxError,
  } = useSellFundsKGC();
  useEffect(() => {
    if (isSellFundsCompleted) {
      dispatch(completeSellFundEvent(sellFundsSentTx?.hash));
    }
  }, [isSellFundsCompleted]);
  useEffect(() => {
    if (
      isSellFundsSentError ||
      isSellFundsError ||
      isApproveSentError ||
      isApprovalError
    ) {
      const error =
        sellFundsSentError ||
        sellFundsTxError ||
        approveSentError ||
        approvalTxError;
      dispatch(
        createTxLog({
          walletAddress: address,
          ...(sellFundsSentTx?.hash && { txHash: sellFundsSentTx?.hash }),
          error: JSON.stringify(error?.message),
        })
      );
      toast.error("failed, Please try again after some time.");
    }
  }, [
    isSellFundsSentError,
    isSellFundsError,
    isApproveSentError || isApprovalError,
  ]);

  const { kgcTokens: kgcLiveRate } = useGetCurrentPrice();
  const { kgcTokens: sellAmountInKGC } = useGetKGCLiveTokens(sellAmount);
  // const { stakeLimitInUSDC, refetchMinUSDC, refetchMaxUSDC } =
  //   useReadSakeLimitInUSDC(stakeLimit.min, stakeLimit.max);
  const handleSubmit = async () => {
    if (chain.id !== ENV.chainId) {
      return switchNetwork?.(ENV.chainId);
    }
    // if (availableUSDC < stakeLimit?.min) {
    //   return toast.error("Insuficient funds", {
    //     duration: 5000,
    //   });
    // }

    handleSellFunds();
  };
  function truncateDecimals(number, digits) {
    const power = Math.pow(10, digits);
    return Math.floor(number * power) / power;
  }
  const handleSellFunds = async () => {
    try {
      //Dispatch the sell funds async thunk
      const response = await dispatch(
        sellFund({
          userId,
          amount: sellAmount,
          type: "sell",
        })
      );
      setSellRecord(response.payload.data);
      if (response?.meta?.requestStatus === "fulfilled") {
        let amount = 0
        if (Number(Number(sellAmount).toFixed(6)) === Number(Number(availableKGC).toFixed(6))) {
          amount = availableKGC
        } else {
          amount = sellAmount
        }
        approveKgcTokens({
          args: [
            CONTRACT_INFO?.main.address,
            ethers.utils.parseEther(`${truncateDecimals(amount, 7)}`),
          ],
          from: address,
        });
        return;
      }
      toast.error("Error while selling the funds!", {
        duration: 5000,
      });
    } catch (error) {
      console.error("Error while selling the funds!", error.message);
    }
  };

  const completeSellFunds = async (txHash) => {
    const response = await dispatch(
      completeSellFund({
        id: sellRecord?._id,
        data: {
          userId,
          txHash,
          fiatAmount: Number(sellAmountInUSDC),
          cryptoAmount: Number(sellAmount),
        },
      })
    );
  };
  useEffect(() => {

    if (isApprovalCompleted) {
      let amount = 0
      if (Number(Number(sellAmount).toFixed(6)) === Number(Number(availableKGC).toFixed(6))) {
        amount = availableKGC
      } else {
        amount = sellAmount
      }
      sellFundsKGC({
        args: [ethers.utils.parseEther(`${truncateDecimals(amount, 7)}`)],
        from: address,
      });
    }
  }, [isApprovalCompleted]);

  useEffect(() => {
    if (sellFundsSentTx?.hash) {
      completeSellFunds(sellFundsSentTx?.hash);
    }
  }, [sellFundsSentTx]);

  useEffect(() => {
    if (isFetchedKGC && Number(Number(availableKGC).toFixed(6)) < +sellAmount) {
      setError("Insufficient BRC Tokens!");
    } else {
      setError(null);
    }
  }, [isFetchedUSDC, sellAmount, availableKGC]);
  useEffect(() => {
    if (user) {
      setUserId(user?.data?._id);
    }
  }, [user]);
  // const roundKgcAmount = (amountInKgc) => {
  //   if (Number(amountInKgc) < stakeLimit.min && sellAmount >= stakeLimitInUSDC.min) {
  //     return Math.ceil(Number(amountInKgc));
  //   }
  //   return amountInKgc;
  // };
  useEffect(() => {
    if (socket && userId) {
      socket.emit("join", userId); // replace userId
      const handleSell = ({ }) => {
        toast.success("Tokens Exchanged Successfully!", {
          duration: 2000,
        });
        refetchKGCTokens();
        refetchUSDCTokens();
        setSellAmount("");
        setKGCAmount("");
      };

      socket.on("SELL", handleSell);

      return () => {
        socket.off("SELL", handleSell); // Remove the event listener
        socket.emit("leave", userId); // replace userId
      };
    }
  }, [socket, userId]);

  useEffect(() => {
    if (userId) {
      dispatch(availableToConvert(userId));
    }
  }, [dispatch, userId, user])



  useEffect(() => {
    if (userData?.data?.isKGCSaleInactive === true) {
      setError(`We're experiencing a technical issue. Our team is currently working to resolve it.`);
    } else if (
      userData?.data?.totalStakeAmount < 50 ||
      selectAvailableAmountToConvert <= sellAmount
    ) {
      setError("withdrawal unavailable");
    }
  }, [availableKGC, sellAmount, selectAvailableAmountToConvert]);
  return (
    <Card sx={{ p: 8 }}>
      <Card sx={{ border: 1 }}>
        <CardHeader
          sx={{ textAlign: "center", py: 8, fontSize: 24 }}
          title={`Available BRC Balance : ${availableKGC?.toFixed(6) || 0}`}
        />
        <Divider sx={{ m: "0 !important" }} />
        <form onSubmit={(e) => e.preventDefault()}>
          <CardContent>
            <Grid container spacing={5}>
              <Grid item xs={12}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Enter Amount*
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <CustomTextField
                  fullWidth
                  label=""
                  placeholder="Enter BRC Amount"
                  value={sellAmount}
                  // disabled={availableUSDC < stakeLimitInUSDC?.min}
                  onChange={(e) => {
                    let value = e?.target?.value;

                    // Remove leading zeros
                    value = value?.replace(/^0+(?=\d)/, "");

                    // Replace multiple consecutive dots with a single dot
                    value = value?.replace(/(\.[^.]*\.)+/g, ".");

                    // Restrict to only one dot
                    value = value?.replace(/(\..*)\./g, "$1");

                    // Restrict to only two decimal places
                    const parts = value?.split(".");
                    if (parts?.length > 1) {
                      value = `${parts[0]}.${parts[1]?.slice(0, 6)}`;
                    }
                    if (userData?.data?.isKGCSaleInactive === true) {
                      setError(`We're experiencing a technical issue. Our team is currently working to resolve it.`);
                    }
                    if (
                      userData?.data?.totalStakeAmount < 50 ||
                      !(selectAvailableAmountToConvert > sellAmount)
                    ) {
                      setError(`Withdrawal unavailable`);
                    }
                    setSellAmount(value);
                  }}
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
                {error && (
                  <Typography
                    variant="body2"
                    style={{ color: "#C9A84C" }}
                    sx={{ fontWeight: 600 }}
                  >
                    {error}
                  </Typography>
                )}
              </Grid>
            </Grid>

            <Grid container spacing={5} mt={2}>
              <Grid item xs={12}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  USDT TOKENS*
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <CustomTextField
                  fullWidth
                  label=""
                  type="number"
                  disabled={true}
                  placeholder="USDT Tokens"
                  value={
                    sellAmount == 0
                      ? 0
                      : Number(sellAmountInUSDC || 0)?.toFixed(2) || 0
                  }
                />
              </Grid>
            </Grid>
            <Box sx={{ display: "flex", mt: 10, alignItems: "center" }}>
              <Box sx={{ mr: 4 }}>
                <img
                  src="/images/favicon.ico"
                  width="32"
                  height="32"
                  alt="brc-logo"
                />

                {/* <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32">
                  <g fill="none">
                    <circle cx="16" cy="16" r="16" fill="#F3BA2F" />
                    <path
                      fill="#FFF"
                      d="M12.116 14.404L16 10.52l3.886 3.886 2.26-2.26L16 6l-6.144 6.144 2.26 2.26zM6 16l2.26-2.26L10.52 16l-2.26 2.26L6 16zm6.116 1.596L16 21.48l3.886-3.886 2.26 2.259L16 26l-6.144-6.144-.003-.003 2.263-2.257zM21.48 16l2.26-2.26L26 16l-2.26 2.26L21.48 16zm-3.188-.002h.002v.002L16 18.294l-2.291-2.29-.004-.004.004-.003.401-.402.195-.195L16 13.706l2.293 2.293z"
                    />
                  </g>
                </svg> */}
              </Box>
              <Box>
                <Typography
                  variant="span"
                  sx={{ textDecoration: "uppercase", mt: 4, color: "#9e9eb3" }}
                >
                  BRC Live Rate
                </Typography>
                <Box sx={{ display: "flex", alignItems: "baseline" }}>
                  <Typography
                    variant="h4"
                    sx={{
                      mt: 1,
                      mb: 0,
                      color: "#7367f0",
                      fontWeight: 600,
                      fontSize: 20,
                    }}
                  >
                    {formatNumber(kgcLiveRate, toFixedDecimal) || 0}
                  </Typography>
                  <Typography
                    variant="span"
                    sx={{ mt: "auto", ml: 2, mb: 0.5 }}
                  >
                    BRC
                  </Typography>
                </Box>
              </Box>
            </Box>
            {/* <Box sx={{ display: "flex", mt: 6, alignItems: "center" }}>
              <Box sx={{ mr: 4 }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32">
                  <g fill="none">
                    <circle cx="16" cy="16" r="16" fill="#F3BA2F" />
                    <path
                      fill="#FFF"
                      d="M12.116 14.404L16 10.52l3.886 3.886 2.26-2.26L16 6l-6.144 6.144 2.26 2.26zM6 16l2.26-2.26L10.52 16l-2.26 2.26L6 16zm6.116 1.596L16 21.48l3.886-3.886 2.26 2.259L16 26l-6.144-6.144-.003-.003 2.263-2.257zM21.48 16l2.26-2.26L26 16l-2.26 2.26L21.48 16zm-3.188-.002h.002v.002L16 18.294l-2.291-2.29-.004-.004.004-.003.401-.402.195-.195L16 13.706l2.293 2.293z"
                    />
                  </g>
                </svg>
              </Box>
              <Box>
                <Typography
                  variant="span"
                  sx={{ textDecoration: "uppercase", mt: 4, color: "#9e9eb3" }}
                >
                  AVAILABLE
                </Typography>
                <Box sx={{ display: "flex", alignItems: "baseline" }}>
                  <Typography
                    variant="h4"
                    sx={{
                      mt: 1,
                      mb: 0,
                      color: "#008000",
                      fontWeight: 600,
                      fontSize: 20,
                    }}
                  >
                    {availableKGC
                      ? formatNumber(Number(availableKGC), toFixedDecimal)
                      : 0}
                  </Typography>
                  <Typography
                    variant="span"
                    sx={{ mt: "auto", ml: 2, mb: 0.5 }}
                  >
                    BRC
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box sx={{ display: "flex", mt: 6, alignItems: "center" }}>
              <Box sx={{ mr: 4 }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32">
                  <g fill="none">
                    <circle cx="16" cy="16" r="16" fill="#F3BA2F" />
                    <path
                      fill="#FFF"
                      d="M12.116 14.404L16 10.52l3.886 3.886 2.26-2.26L16 6l-6.144 6.144 2.26 2.26zM6 16l2.26-2.26L10.52 16l-2.26 2.26L6 16zm6.116 1.596L16 21.48l3.886-3.886 2.26 2.259L16 26l-6.144-6.144-.003-.003 2.263-2.257zM21.48 16l2.26-2.26L26 16l-2.26 2.26L21.48 16zm-3.188-.002h.002v.002L16 18.294l-2.291-2.29-.004-.004.004-.003.401-.402.195-.195L16 13.706l2.293 2.293z"
                    />
                  </g>
                </svg>
              </Box>
              <Box>
                <Typography
                  variant="span"
                  sx={{ textDecoration: "uppercase", mt: 4, color: "#9e9eb3" }}
                >
                  AVAILABLE
                </Typography>
                <Box sx={{ display: "flex", alignItems: "baseline" }}>
                  <Typography
                    variant="h4"
                    sx={{
                      mt: 1,
                      mb: 0,
                      color: "#008000",
                      fontWeight: 600,
                      fontSize: 20,
                    }}
                  >
                    {availableUSDC || 0}
                  </Typography>
                  <Typography
                    variant="span"
                    sx={{ mt: "auto", ml: 2, mb: 0.5 }}
                  >
                    USDC($)
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                mt: 8,
              }}
            >
              <Typography
                variant="h5"
                sx={{ textAlign: "center", mt: 1, mb: 1 }}
              >
                <Typography variant="span" sx={{ fontSize: 14 }}>
                  Minimum:
                </Typography>
                <Typography
                  variant="span"
                  sx={{ px: 2, color: "#7367f0", fontWeight: 600 }}
                >
                  ${stakeLimitInUSDC?.min}
                </Typography>
              </Typography>
              <Typography
                variant="h5"
                sx={{ textAlign: "center", mt: 1, mb: 1 }}
              >
                <Typography variant="span" sx={{ fontSize: 14 }}>
                  Maximum:
                </Typography>
                <Typography
                  variant="span"
                  sx={{ px: 2, color: "#7367f0", fontWeight: 600 }}
                >
                  ${stakeLimitInUSDC?.max}
                </Typography>
              </Typography>
              <Typography
                variant="h5"
                sx={{ textAlign: "center", mt: 1, mb: 1 }}
              >
                <Typography variant="span" sx={{ fontSize: 14 }}>
                  Staking Bonus:
                </Typography>
                <Typography
                  variant="span"
                  sx={{ px: 2, color: "#7367f0", fontWeight: 600 }}
                >
                  12.0% Monthly
                </Typography>
              </Typography>
              <Typography
                variant="h5"
                sx={{ textAlign: "center", mt: 1, mb: 1 }}
              >
                <Typography variant="span" sx={{ fontSize: 14 }}>
                  Per day:
                </Typography>
                <Typography
                  variant="span"
                  sx={{ px: 2, color: "#7367f0", fontWeight: 600 }}
                >
                  0.40%
                </Typography>
              </Typography>
            </Box> */}
          </CardContent>
          <Divider sx={{ m: "0 !important" }} />
          <CardActions>
            <Button
              fullWidth
              type="submit"
              sx={{ mr: 2 }}
              variant="contained"
              disabled={
                isApprovekgcTxInProgress ||
                isApprovalTokensWaiting ||
                isSellFundsUsdcTxInProgress ||
                isSellFundsTokensWaiting ||
                !sellAmount ||
                error ||
                sellAmount < 0.00001 ||
                userData?.data?.totalStakeAmount < 50 ||
                !(selectAvailableAmountToConvert > sellAmount) ||
                userData?.data?.isKGCSaleInactive === true
                // accError
                // ||
                // chainError
              }
              onClick={handleSubmit}
            >
              {accError
                ? `Please connect with ${
                    user?.data?.walletAddress?.slice(0, 6) +
                    "..." +
                    user?.data?.walletAddress?.slice(-6)
                  } wallet address `
                : isApprovekgcTxInProgress
                ? "Approve Transaction"
                : isApprovalTokensWaiting
                ? "Approving Tokens"
                : isSellFundsUsdcTxInProgress
                ? "Approving Transaction"
                : isSellFundsTokensWaiting
                ? "Transaction is in Progress, Please wait!"
                : "Sell Now"}
            </Button>
          </CardActions>
        </form>
      </Card>
    </Card>
  );
};

export default SellFunds;
