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
import { completeStack } from "src/store/apps/transaction/completeTransactionEvents";
import { createTxLog } from "src/store/apps/transaction/transactionLogsSlice";

import { toast } from "react-hot-toast";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

function AnimatedCounter({ from, to }) {
  const count = useMotionValue(from);
  const rounded = useTransform(count, (latest) => {
    const num = Math.round(latest * 10) / 10;
    return (num % 1 === 0 ? num + ".0" : num) + "% Monthly";
  });

  useEffect(() => {
    const controls = animate(count, to, { duration: 2.5, ease: "easeOut" });
    return controls.stop;
  }, []);

  return <motion.span>{rounded}</motion.span>;
}

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
import useGetCurrentPrice from "src/hooks/useGetCurrentPrice";
const Stake = () => {
  const { address } = useAccount();
  const dispatch = useDispatch();
  const user = useSelector((state) => state?.login?.user);
  const { accError, chainError, chain } = useValidateAccount();
  const { stake } = useSelector((state) => state.stake);

  const [userId, setUserId] = useState(null);
  const [stakeAmount, setStakeAmount] = useState(null);
  const [contribution, setContribution] = useState(true);
  const [kgcAmount, setKGCAmount] = useState(0);
  const [minMaxError,setMinMaxError]=useState(null)
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
  } = useGetUSDCTokens(availableKGC);
  function truncateDecimals(number, digits) {
    const power = Math.pow(10, digits);
    return Math.floor(number * power) / power;
}
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
    stakeLimit,
    stakeSentTx,
    isStakekgcSentTxInProgress,
    isStakekgcTxInProgress,
    stakeKgcTokens,
    isstakeCompleted,
    isStakeSentError,
    isStakeError,
    stakeSentError,
    stakeTxError,
  } = useContractStake();
  useEffect(() => {
    if (isstakeCompleted) {
      dispatch(completeStack(stakeSentTx?.hash));
    }
  }, [isstakeCompleted]);
  useEffect(() => {
    if (
      isStakeSentError ||
      isStakeError ||
      isApproveSentError ||
      isApprovalError
    ) {
      const error =
        stakeSentError || stakeTxError || approveSentError || approvalTxError;
      dispatch(
        createTxLog({
          walletAddress: address,
          ...(stakeSentTx?.hash && { txHash: stakeSentTx?.hash }),
          error: JSON.stringify(error?.message),
        })
      );
      toast.error(error?.message)
    }
  }, [isStakeSentError, isStakeError, isApproveSentError || isApprovalError]);

  const { kgcTokens: kgcLiveRate } = useGetCurrentPrice();
  const { kgcTokens: stakeAmountInKGC } = useGetKGCLiveTokens(stakeAmount);
  const { stakeLimitInUSDC, refetchMinUSDC, refetchMaxUSDC } =
    useReadSakeLimitInUSDC(stakeLimit.min, stakeLimit.max);
  const handleSubmit = async () => {
    if (chain.id !== ENV.chainId) {
      return switchNetwork?.(ENV.chainId);
    }
    if (availableUSDC < stakeLimitInUSDC?.min) {
      return toast.error("Insufficient Funds", {
        duration: 5000,
      });
    }

    addStake();
  };
  const addStake = async () => {
    try {
      // Dispatch the stakeKgc async thunk
      const response = await dispatch(
        stakeKGC({
          userId,
          amount:roundKgcAmount(Number(stakeAmountInKGC)) ,
        })
      );

      if (response?.meta?.requestStatus === "fulfilled") {
        approveKgcTokens({
          args: [
            CONTRACT_INFO?.main.address,
            ethers.utils.parseEther(`${roundKgcAmount(stakeAmountInKGC)}`),
          ],
          from: address,
        });
      }
    } catch (error) {
      console.error("Error while staking the amount!", error.message);
    }
  };

  const completeStake = async (txHash) => {
    const response = await dispatch(
      completeStakekGC({
        id: stake?.data?._id,
        data: {
          userId,
          txHash,
          fiatAmount: Number(stakeAmount),
          cryptoAmount: Number(stakeAmountInKGC),
        },
      })
    );
  };
  useEffect(() => {
    if (isApprovalCompleted) {
      stakeKgcTokens({
        args: [ethers.utils.parseEther(`${roundKgcAmount(stakeAmountInKGC)}`)],
        from: address,
      });
    }
  }, [isApprovalCompleted]);

  useEffect(() => {
    if (stakeSentTx?.hash) {
      completeStake(stakeSentTx?.hash);
    }
  }, [stakeSentTx]);

  useEffect(() => {
    if (isFetchedKGC && Number(availableKGC) < +stakeAmountInKGC) {
      setError("Insufficient USDT Tokens!");
    } else {
      setError(null);
    }
  }, [isFetchedUSDC, stakeLimit,stakeAmountInKGC,availableKGC]);
  useEffect(() => {
    if (user) {
      setUserId(user?.data?._id);
    }
  }, [user]);
  const roundKgcAmount = (amountInKgc) => {
    if (Number(amountInKgc) < stakeLimit.min && stakeAmount >= stakeLimitInUSDC.min) {
      return Math.ceil(Number(amountInKgc));
    }
    return amountInKgc;
  };
  useEffect(() => {
    if (socket && userId) {
      socket.emit("join", userId); // replace userId
      const handleStake = ({}) => {
        toast.success("Tokens Staked Successfully!", {
          duration: 2000,
        });
        refetchMinUSDC()
        refetchMaxUSDC()
        refetchKGCTokens();
        refetchUSDCTokens();
        setStakeAmount("");
        setKGCAmount("");
      };

      socket.on("Stake", handleStake);

      return () => {
        socket.off("Stake", handleStake); // Remove the event listener
        socket.emit("leave", userId); // replace userId
      };
    }
  }, [socket, userId]);

  return (
    <Card sx={{ p: { xs: 3, md: 8 } }}>
      <Card sx={{ border: 1 }}>
        <CardHeader
          sx={{ textAlign: "center", py: { xs: 4, md: 8 }, fontSize: { xs: 24, md: 30 } }}
          title={
            contribution === true
              ? "Stake BRC"
              : "Pay $3 for LP (Liquidity pool)"
          }
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
                  value={stakeAmount}
                  disabled={availableUSDC < stakeLimitInUSDC?.min}
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

                    const isMinError = +value < stakeLimitInUSDC?.min;
                    const isMaxError = +value > stakeLimitInUSDC?.max;

                    if (isMinError || isMaxError) {
                      setMinMaxError(
                        `${isMaxError ? "Max" : "Min"} ${
                          isMaxError ? stakeLimitInUSDC?.max : stakeLimitInUSDC?.min
                        } usdt tokens allowed`
                      );
                    } else {
                      setMinMaxError(null);
                    }

                    setStakeAmount(value);
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
                {minMaxError &&!error&& (
                  <Typography
                    variant="body2"
                    style={{ color: "#C9A84C" }}
                    sx={{ fontWeight: 600 }}
                  >
                    {minMaxError}
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
                  value={roundKgcAmount(stakeAmountInKGC) || 0}
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
            <Box sx={{ display: "flex", mt: 6, alignItems: "center" }}>
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
                      ? truncateDecimals(availableKGC,5)
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
                  AVAILABLE (Against Current BRC Balance)
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
                    { availableUSDC?truncateDecimals(availableUSDC,5) : 0}
                  </Typography>
                  <Typography
                    variant="span"
                    sx={{ mt: "auto", ml: 2, mb: 0.5 }}
                  >
                    USDT($)
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
                  sx={{ px: 2, color: "#C9A84C", fontWeight: 600 }}
                >
                  <AnimatedCounter from={0} to={12} />
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
            </Box>
          </CardContent>
          <Divider sx={{ m: "0 !important" }} />
          <CardActions>
            <motion.div
              style={{ width: "100%", display: "flex", justifyContent: "center" }}
              animate={
                !(
                  isApprovekgcTxInProgress ||
                  isApprovalTokensWaiting ||
                  isStakekgcSentTxInProgress ||
                  isStakekgcTxInProgress ||
                  !stakeAmount ||
                  error ||
                  accError ||
                  minMaxError
                )
                  ? {
                      scale: [1, 1.02, 1],
                      boxShadow: [
                        "0px 0px 0px rgba(201,168,76,0)",
                        "0px 0px 15px rgba(201,168,76,0.5)",
                        "0px 0px 0px rgba(201,168,76,0)",
                      ],
                    }
                  : {}
              }
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Button
                fullWidth
                type="submit"
                sx={{ mr: 2 }}
                variant="contained"
                disabled={
                  isApprovekgcTxInProgress ||
                  isApprovalTokensWaiting ||
                  isStakekgcSentTxInProgress ||
                  isStakekgcTxInProgress ||
                  !stakeAmount ||
                  error ||
                  accError ||
                  minMaxError
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
                  : isStakekgcSentTxInProgress
                  ? "Approving Transaction"
                  : isStakekgcTxInProgress
                  ? "Transaction is in Progress, Please wait!"
                  : "Activate Now"}
              </Button>
            </motion.div>
          </CardActions>
        </form>
      </Card>
    </Card>
  );
};

export default Stake;
