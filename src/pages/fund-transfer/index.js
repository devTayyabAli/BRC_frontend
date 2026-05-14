import React, { useState, useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import CustomTextField from "src/@core/components/mui/text-field";
import { fundsTransfer } from "src/store/apps/transaction/transactionSlice";
import { completeFundsTransfer } from "src/store/apps/transaction/completeTransactionSlice";
import { completeP2P } from "src/store/apps/transaction/completeTransactionEvents";
import toast from "react-hot-toast";
import { useAccount } from "wagmi";
import api from "src/api/api";
import { GET_REFERRAL_DETAIL_ENDPOINT } from "src/api/apiEndPoint";
import { useFormik } from "formik";
import { CONTRACT_INFO } from "src/contract";
import useContractFundTransfer from "src/hooks/useContractFundTransfer";
import useGetKGCLiveTokens from "src/hooks/useGetKGCLiveTokens";
import useApproveKGCTokens from "src/hooks/useApproveKGCTokens";
import { ethers } from "ethers";
import SocketContext from "src/context/Socket";
import { useContractRegister } from "src/hooks/useContractRegister";
import useGetUSDCTokens from "src/hooks/useGetUSDCTokens";
import useValidateAccount from "src/hooks/useValidateAccount";
import { useSwitchNetwork } from "wagmi";
import { createTxLog } from "src/store/apps/transaction/transactionLogsSlice";
import { ENV } from "src/configs/env";
import { truncateDecimals } from "src/constants/common";
const validationSchema = yup.object().shape({
  toUserId: yup.string().required("Transfer to User ID is required."),
  amount: yup.number().required("Amount is required."),
});

const FundTransfer = () => {
  const { address } = useAccount();
  const dispatch = useDispatch();

  //socket
  const socket = useContext(SocketContext);
  const { accError, chainError, chain } = useValidateAccount();
  const { switchNetwork } = useSwitchNetwork({
    onSuccess(data) {
      transferFunds(payload);
    },
  });

  const { user } = useSelector((state) => state?.login);
  const [userDetails, setUserDetails] = useState(null);
  const [payload, setPayload] = useState(null);
  const [userId, setUserId] = useState(null);
  const [customError, setCustomError] = useState("");
  const { fundsTransfer: pendingTx } = useSelector(
    (state) => state.fundsTransfer
  );
  const [transferAmount, setTransferAmount] = useState({
    cryptoAmount: 0,
    fiatAmount: 0,
  });
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    if (user) {
      setUserId(user?.data?._id);
    }
  }, [user]);

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

  const { kgcTokens: buyFundAmountInKGC } = useGetKGCLiveTokens(amount);

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
  const { kgcTokens: kgcLiveRate } = useGetKGCLiveTokens(1);
    const {
      transferKgcTokens,
      transferSentTx,
      isTransferkgcSentTxInProgress,
      isTransferkgcTxInProgress,
      isTransferKgcTxSent,
      isTransferCompleted,
      isTransferSentError,
      transferSentError,
      isTransferError,
      transferTxError,
    } = useContractFundTransfer();

  useEffect(() => {
    if (isApprovalCompleted) {
      transferKgcTokens({
        args: [
          userDetails?.walletAddress || "", //to address
          ethers.utils.parseEther(`${truncateDecimals(transferAmount?.cryptoAmount, 8)}`),
        ],
      });
    }
  }, [isApprovalCompleted]);

  useEffect(() => {
    if (
      isTransferSentError ||
      isTransferError ||
      isApproveSentError ||
      isApprovalError
    ) {
      const error =
        transferSentError ||
        transferTxError ||
        approveSentError ||
        approvalTxError;
      dispatch(
        createTxLog({
          walletAddress: address,
          ...(transferSentTx?.hash && { txHash: transferSentTx?.hash }),
          error: JSON.stringify(error?.message),
        })
      );
      toast.error(error?.message);
    }
  }, [
    isTransferSentError,
    isTransferError,
    isApproveSentError || isApprovalError,
  ]);

  useEffect(() => {
    if (transferSentTx?.hash) {
      const { cryptoAmount, fiatAmount } = transferAmount;

      dispatch(
        completeFundsTransfer({
          id: pendingTx?.data._id,
          data: {
            txHash: transferSentTx?.hash,
            userId,
            cryptoAmount,
            fiatAmount,
          },
        })
      );
    }
  }, [transferSentTx]);
  useEffect(() => {
    if (isTransferCompleted) {
      dispatch(completeP2P(transferSentTx?.hash));
    }
  }, [isTransferCompleted]);

  const formik = useFormik({
    initialValues: {
      toUserId: "",
      fromUserId: "",
      amount: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setPayload(values);
      if (chain?.id !== ENV.chainId) {
        return switchNetwork?.(ENV.chainId);
      }
      transferFunds(values);
    },
  });

  const transferFunds = async (values) => {
    try {
      let maxAmountTransfer = 0;
      if (Number(buyFundAmountInKGC) > availableKGC) {
        maxAmountTransfer = availableKGC;
      }else {
        maxAmountTransfer=Number(buyFundAmountInKGC)
      }

      const payload = {
        toUserId: userDetails && userDetails?._id,
        fromUserId: userId,
        amount: maxAmountTransfer,
      };
      const response = await dispatch(fundsTransfer(payload));
      if (response?.meta?.requestStatus === "fulfilled") {
        //approve tokens here
        setTransferAmount({
          fiatAmount: values.amount,
          cryptoAmount: maxAmountTransfer,
        });
        approveKgcTokens({
          args: [
            CONTRACT_INFO?.main.address,
            ethers.utils.parseEther(`${maxAmountTransfer}`),
          ],
          from: address,
        });
      }
    } catch (error) {
      console.error("Error while transferring the amount!", error.message);
    }
  };

  const fetchUserDetails = async (userId) => {
    try {
      const response = await api.get(
        `${GET_REFERRAL_DETAIL_ENDPOINT}/${userId}`
      );
      setUserDetails(response?.data?.data);
    } catch (error) {
      setUserDetails(null);
    }
  };

  const handleUserIdChange = async (event) => {
    const userId = event?.target?.value;
    if (userId === user?.data?.userName) {
      setCustomError("Transferring funds to own account not permitted.");
      return;
    }
    if (userId?.trim() !== "") {
      await fetchUserDetails(userId);
      return;
    }
    setUserDetails(null);
  };

  useEffect(() => {
    if (socket && userId) {
      socket.emit("join", userId); // replace userId
      const handleKGCTransfer = ({}) => {
        formik.resetForm();
        setTransferAmount({
          cryptoAmount: 0,
          fiatAmount: 0,
        });
        refetchUSDCTokens();
        refetchKGCTokens();
        setUserDetails(null);
        toast.success("Tokens Transferred Successfully!", {
          duration: 2000,
        });
        setAmount(0)
      };

      socket.on("KGCTransfer", handleKGCTransfer);

      return () => {
        socket.off("KGCTransfer", handleKGCTransfer); // Remove the event listener
        socket.emit("leave", userId); // replace userId
      };
    }
  }, [socket, userId]);

  return (
    <Card sx={{ p: 8 }}>
      <Card sx={{ border: 1 }}>
        <CardHeader
          sx={{ textAlign: "center", py: 8, fontSize: 24 }}
          title={`Available Balance : $${availableUSDC || 0}`}
        />
        <Divider sx={{ m: "0 !important" }} />
        <form noValidate autoComplete="off" onSubmit={formik.handleSubmit}>
          <CardContent>
            <Grid container spacing={5} sx={{ mb: 4 }}>
              <Grid item xs={12} md={12} lg={12}>
                <CustomTextField
                  fullWidth
                  label="Transfer to User ID*"
                  sx={{ mb: 4 }}
                  placeholder="Enter Transfer to User ID"
                  {...formik.getFieldProps("toUserId")}
                  onBlur={handleUserIdChange}
                  error={
                    formik.touched.toUserId && Boolean(formik.errors.toUserId)
                  }
                  helperText={
                    (formik.touched.toUserId && formik.errors.toUserId) || (
                      <span style={{ color: "#C9A84C" }}>{customError}</span>
                    )
                  }
                />
              </Grid>
            </Grid>
            <Grid container spacing={5} sx={{ mb: 4 }}>
              <Grid item xs={12} md={12} lg={12}>
                <CustomTextField
                  fullWidth
                  label="Transfer to User (Full Name)"
                  sx={{ mb: 4 }}
                  placeholder="Transfer to User Full Name"
                  disabled={true}
                  value={userDetails ? userDetails?.name : ""}
                />
              </Grid>
            </Grid>
            <Grid container spacing={5} sx={{ mb: 4 }}>
              <Grid item xs={12} md={12} lg={12}>
                <CustomTextField
                  fullWidth
                  label="Transfer to User (Wallet Address)"
                  sx={{ mb: 4 }}
                  placeholder="Transfer to User Wallet Address"
                  disabled={true}
                  value={userDetails ? userDetails?.walletAddress : ""}
                />
              </Grid>
            </Grid>
            <Grid container spacing={5} sx={{ mb: 4 }}>
              <Grid item xs={12} md={12} lg={12}>
                <CustomTextField
                  fullWidth
                  label="Amount to Transfer*"
                  sx={{ mb: 4 }}
                  placeholder="Enter Amount to Transfer"
                  {...formik.getFieldProps("amount")}
                  error={formik.touched.amount && Boolean(formik.errors.amount)}
                  helperText={formik.touched.amount && formik.errors.amount}
                  onKeyPress={(e) => {
                    if (
                      !/^\d*\.?\d*$/.test(e.key) &&
                      e.key !== "Backspace" &&
                      e.key !== "Delete"
                    ) {
                      e.preventDefault();
                    }
                  }}
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
                    if (parts.length > 1) {
                      value = `${parts[0]}.${parts[1]?.slice(0, 10)}`;
                    }
                    if (value == 0.0000001) {
                      return;
                    }
                    formik?.setFieldValue("amount", value);
                    setAmount(value);
                  }}
                />
                {(formik?.values?.amount < 1 ||
                  formik?.values?.amount > availableUSDC) && (
                  <Typography
                    variant="p"
                    sx={{ color: "#f16d75", fontSize: 12 }}
                  >
                    {formik?.values?.amount < 1
                      ? "Note : Minimum Transfer 1 USDT($)."
                      : formik?.values?.amount > availableUSDC
                      ? `Note : Maximum Transfer ${availableUSDC} USDT($).`
                      : ""}
                  </Typography>
                )}
              </Grid>
            </Grid>
            <Grid container spacing={5} sx={{ mb: 4 }}>
              <Grid item xs={12} md={12} lg={12}>
                <CustomTextField
                  fullWidth
                  label="Your Wallet Address"
                  sx={{ mb: 4 }}
                  disabled={true}
                  value={address}
                />
              </Grid>
            </Grid>
          </CardContent>
          <Divider sx={{ m: "0 !important" }} />
          <CardActions>
            <Button
              fullWidth
              type="submit"
              sx={{ mr: 2 }}
              // disabled={true}
              disabled={
                isApprovekgcTxInProgress ||
                isApprovalTokensWaiting ||
                isTransferkgcTxInProgress ||
                isTransferkgcSentTxInProgress ||
                formik?.values?.amount < 1 ||
                formik?.values?.amount > availableUSDC ||
                accError || userDetails === null
              }
              variant="contained"
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
                : isTransferkgcSentTxInProgress
                ? "Approving Transaction"
                : isTransferkgcTxInProgress
                ? "Transaction is in Progress, Please wait!"
                : " Activate Now"}
            </Button>
          </CardActions>
        </form>
      </Card>
    </Card>
  );
};

export default FundTransfer;
