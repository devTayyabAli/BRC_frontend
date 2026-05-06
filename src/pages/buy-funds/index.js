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
import { completeStakekGC } from "src/store/apps/stake/completeStakeSlice";
import { completeBuyFundEvent, completeStack } from "src/store/apps/transaction/completeTransactionEvents";
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
import useBuyFundsKGC from "src/hooks/useBuyFundsKGC";
import useApproveUSDCtokens from "src/hooks/useApproveUSDCTokens";
import { buyFund, completeBuyFund } from "src/store/apps/transaction/transactionSlice";
import useGetUSDTAmount from "src/hooks/useGetUSDTAmount";
import useGetCurrentPrice from "src/hooks/useGetCurrentPrice";

const BuyFunds = () => {
  const { address } = useAccount();
  const dispatch = useDispatch();
  const user = useSelector((state) => state?.login?.user);
  const { accError, chainError, chain } = useValidateAccount();
  const { buyFunds } = useSelector((state) => state?.fundsTransfer);
  const [userId, setUserId] = useState(null);
  const [buyFundsAmount, setBuyFundsAmount] = useState(null);
  const [contribution, setContribution] = useState(true);
  const [kgcAmount, setKGCAmount] = useState(0);
  const [buyRecord,setBuyRecord]=useState(null)
  const [error, setError] = useState(null);
  const { switchNetwork } = useSwitchNetwork({
    onSuccess(data) {
      addStake();
    },
  });

  const {
    tokenBlnc: availableKGC,
    refetch: refetchKGCTokens,
    isSuccess: isFetchedKGC,
  } = useContractRegister(address);

  const {
    tokenBlnc: availableUSDC,
    isSuccess: isFetchedUSDC,
    refetch: refetchUSDCTokens,
  } = useGetUSDTAmount(address);
  //sockets
  const socket = useContext(SocketContext);
  const {
    isApproveSentError,
    approveSentTx,
    isApproveUsdcTxInProgress,
    isApproveUSDCtxSent,
    approveUsdcTokens,
    isApprovalCompleted,
    isApprovalError,
    isApprovalTokensWaiting,
    approveSentError,
    approvalTxError
  } = useApproveUSDCtokens();

  const {
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
  } = useBuyFundsKGC();
  useEffect(() => {
    if (isBuyFundsCompleted) {
      dispatch(completeBuyFundEvent(buyFundsSentTx?.hash));
    }
  }, [isBuyFundsCompleted]);
  useEffect(() => {
    if (
      isBuyFundsSentError ||
      isBuyFundsError ||
      isApproveSentError ||
      isApprovalError
    ) {
      const error =
      buyFundsSentError || buyFundsTxError || approveSentError || approvalTxError;
      dispatch(
        createTxLog({
          walletAddress: address,
          ...(buyFundsSentTx?.hash && { txHash: buyFundsSentTx?.hash }),
          error: JSON.stringify(error?.message),
        })
      );
      toast.error("failed, Please try again after some time.");
    }
  }, [isBuyFundsSentError, isBuyFundsError, isApproveSentError || isApprovalError]);

  const { kgcTokens: kgcLiveRate } = useGetCurrentPrice();
  const { kgcTokens: buyFundAmountInKGC } = useGetKGCLiveTokens(buyFundsAmount);
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

    handleBuyFunds();
  };
  const handleBuyFunds = async () => {
    try {
      //Dispatch the buyFunds async thunk
      const response = await dispatch(
        buyFund({
          userId,
          amount:Number(buyFundAmountInKGC) ,
          type:"buy"
        })
      );
      setBuyRecord(response.payload.data)
      let  amount=0
        if(Number(Number(buyFundsAmount).toFixed(6))===Number(Number(availableUSDC).toFixed(6))){
          amount=availableUSDC
        }else {
          amount=buyFundsAmount
        }
      if (
        response?.meta?.requestStatus === "fulfilled"
        ) {
          approveUsdcTokens({
          args: [
            CONTRACT_INFO?.main.address,
            ethers.utils.parseEther(`${amount}`),
          ],
          from: address,
        });
        return;
      }
      toast.error("Error while buying the funds!", {
        duration: 5000,
      });
    } catch (error) {
      console.error("Error while buying the funds!", error.message);
    }
  };

  const completeBuyFunds = async (txHash) => {
    const response = await dispatch(
      completeBuyFund({
        id: buyRecord?._id,
        data: {
          userId,
          txHash,
          fiatAmount: Number(buyFundsAmount),
          cryptoAmount: Number(buyFundAmountInKGC),
        },
      })
    );
  };
  useEffect(() => {
    if (isApprovalCompleted) {
      let  amount=0
      if(Number(Number(buyFundsAmount).toFixed(6))===Number(Number(availableUSDC).toFixed(6))){
        amount=availableUSDC
      }else {
        amount=buyFundsAmount
      }
      buyFundsKGC({
        args: [ethers.utils.parseEther(`${amount}`)],
        from: address,
      });
    }
  }, [isApprovalCompleted]);

  useEffect(() => {
    if (buyFundsSentTx?.hash) {
      completeBuyFunds(buyFundsSentTx?.hash);
    }
  }, [buyFundsSentTx]);

  useEffect(() => {
    if (isFetchedUSDC &&Number( Number(availableUSDC)?.toFixed(6)) < +buyFundsAmount) {
      setError("Insufficient USDT Tokens!");
    } else {
      setError(null);
    }
  }, [isFetchedUSDC,buyFundsAmount,availableUSDC]);
  useEffect(() => {
    if (user) {
      setUserId(user?.data?._id);
    }
  }, [user]);
  // const roundKgcAmount = (amountInKgc) => {
  //   if (Number(amountInKgc) < stakeLimit.min && buyFundsAmount >= stakeLimitInUSDC.min) {
  //     return Math.ceil(Number(amountInKgc));
  //   }
  //   return amountInKgc;
  // };
  useEffect(() => {
    if (socket && userId) {
      socket.emit("join", userId); // replace userId
      const handleStake = ({}) => {

        toast.success("Token Exchange successfully done!", {
          duration: 2000,
        });
        // refetchMinUSDC()
        // refetchMaxUSDC()
        refetchKGCTokens();
        refetchUSDCTokens();
        setBuyFundsAmount("");
        setKGCAmount("");
      };

      socket.on("BUY", handleStake);

      return () => {
        socket.off("BUY", handleStake); // Remove the event listener
        socket.emit("leave", userId); // replace userId
      };
    }
  }, [socket, userId]);

  return (
    <Card sx={{ p: 8 }}>
      <Card sx={{ border: 1 }}>
        <CardHeader
          sx={{ textAlign: "center", py: 8, fontSize: 24 }}
          title={`Available Balance : $${Number(availableUSDC)?.toFixed(6) || 0}`}
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
                  placeholder="Enter Stake Amount ($)"
                  value={buyFundsAmount}
                  // disabled={availableUSDC < stakeLimitInUSDC?.min}
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
                    setBuyFundsAmount(value);
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
                  BRC TOKENS*
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <CustomTextField
                  fullWidth
                  label=""
                  type="number"
                  disabled={true}
                  placeholder="BRC Tokens (BRC)"
                  value={buyFundAmountInKGC || 0}
                />
              </Grid>
            </Grid>
            <Box sx={{ display: "flex", mt: 10, alignItems: "center" }}>
              <Box sx={{ mr: 4 }}>
              <img src="/images/favicon.ico" width="32" height="32" alt="brc-logo" />

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
          </CardContent>
          <Divider sx={{ m: "0 !important" }} />
          <CardActions>
            <Button
              fullWidth
              type="submit"
              sx={{ mr: 2 }}
              variant="contained"
              disabled={
                isApproveUsdcTxInProgress ||
                isApprovalTokensWaiting ||
                isBuyFundsTokensWaiting ||
                isBuyFundsUsdcSentTxInProgress ||
                !buyFundsAmount ||
                error ||
                accError
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
                : isApproveUsdcTxInProgress
                ? "Approve Transaction"
                : isApprovalTokensWaiting
                ? "Approving Tokens"
                : isBuyFundsUsdcSentTxInProgress
                ? "Approving Transaction"
                : isBuyFundsTokensWaiting
                ? "Transaction is in Progress, Please wait!"
                : "Buy Now"}
            </Button>
          </CardActions>
        </form>
      </Card>
    </Card>
  );
};

export default BuyFunds;
