// ** React Imports
import React, { useState } from "react";

// ** MUI Imports
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";

// ** Icon Imports
import Icon from "src/@core/components/icon";

// ** Third Party Imports
import { useForm, Controller } from "react-hook-form";
import CustomTextField from "src/@core/components/mui/text-field";
import { toast } from "react-hot-toast";
import Link from "next/link";

// ** Redux imports
import { getVerificationCode } from "src/store/apps/auth/getVerificationCodeSlice";
import { compareVerificationCode, disable2FA } from "src/store/apps/auth/compareVerificationCodeSlice";
import { getCurrentUser } from "src/store/apps/auth/currentUserSlice";
import { useDispatch, useSelector } from "react-redux";

const CustomCloseButton = styled(IconButton)(({ theme }) => ({
  top: 0,
  right: 0,
  color: "grey.500",
  position: "absolute",
  boxShadow: theme.shadows[2],
  transform: "translate(10px, -10px)",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: `${theme.palette.background.paper} !important`,
  transition: "transform 0.25s ease-in-out, box-shadow 0.25s ease-in-out",
  "&:hover": {
    transform: "translate(7px, -5px)",
  },
}));

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: "none",
  color: `${theme.palette.primary.main} !important`,
}));

const TwoFactor = () => {
  // ** States
  const [open, setOpen] = useState(false);
  const [openDisableDialog, setOpenDisableDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const user = useSelector((state) => state?.login?.user?.data);
  const currentUser = useSelector((state) => state?.getCurrentUser?.user?.data);

  // ** Hooks
  const {
    control,
    setValue,
    clearErrors,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { otp: "" } });

  const toggle2FADialog = () => {
    if (!open) {
      getOTP();
    }
    setOpen(!open);
    clearErrors("otp");
    setValue("otp", "");
  };

  const getOTP = async () => {
    try {
      setLoading(true);
      const response = await dispatch(
        getVerificationCode({ phoneNumber: currentUser?.phoneNumber || "" })
      );
      if (response?.meta?.requestStatus === "fulfilled") {
        const { message, status } = response.payload;
        if (status === 200) {
          toast.success(`${message}`, {
            duration: 5000,
          });
        }
      } else {
        toast.error("Something went wrong!", {
          duration: 5000,
        });
      }
    } catch (error) {
      console.error("[2FA_GET_VERIFICATION_CODE_ERROR]", error);
    } finally {
      setLoading(false);
    }
  };

  const toggle2FADisableDialog = () => {
    if (!openDisableDialog) {
      getOTP();
    }
    setOpenDisableDialog(!openDisableDialog);
    clearErrors("otp");
    setValue("otp", "");
  };

  const on2FAFormSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await dispatch(
        compareVerificationCode({
          otp: data.otp,
        })
      );
      if (response?.meta?.requestStatus === "fulfilled") {
        const { message, status } = response.payload;
        if (status === 200) {
          toast.success(`${message}`, {
            duration: 5000,
          });
          dispatch(getCurrentUser(user._id));
          toggle2FADialog();
        }
      } else {
        toast.error("Wrong OTP!", {
          duration: 5000,
        });
      }
    } catch (error) {
      console.error("[2FA_COMPARE_VERIFICATION_CODE_ERROR]", error);
    } finally {
      setLoading(false);
    }
  };

  const on2FADisableFormSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await dispatch(
        disable2FA({ otp: data.otp })
      );
      if (response?.meta?.requestStatus === "fulfilled") {
        const { message, status } = response.payload;
        if (status === 200) {
          toast.success(`${message}`, {
            duration: 5000,
          });
          dispatch(getCurrentUser(user._id));
          toggle2FADisableDialog();
        }
      } else {
        toast.error("Wrong OTP!", {
          duration: 5000,
        });
      }
    } catch (error) {
      console.error("[2FA_DISABLED_ERROR]", error);
    } finally {
      setLoading(false);
    }
  };

  const close2FADialog = () => {
    toggle2FADialog();
    clearErrors("otp");
    setValue("otp", "");
  };

  const close2FADisableDialog = () => {
    toggle2FADisableDialog();
    clearErrors("otp");
    setValue("otp", "");
  };

  const handleChangeCountryCode = (event) => {
    setCountryCode(event.target.value);
  };

  const maskPhoneNumber = (phoneNumber, trailingCharsIntactCount) => {
    if (phoneNumber?.length > 0) {
      phoneNumber =
        new Array(phoneNumber?.length - trailingCharsIntactCount + 1)?.join(
          "*"
        ) + phoneNumber?.slice(-trailingCharsIntactCount);
      return phoneNumber;
    } else {
      return "";
    }
  };

  return (
    <>
      <Card>
        <CardHeader title="Two-steps verification" />
        {currentUser?.is2faEnabled ? (
          <CardContent>
            <Typography variant="h6" sx={{ mb: 4 }}>
              Two factor authentication is enabled.
            </Typography>
            <Button variant="contained" onClick={toggle2FADisableDialog}>
              Disable two-factor authentication
            </Button>
          </CardContent>
        ) : (
          <CardContent>
            <Typography variant="h6" sx={{ mb: 4 }}>
              Two factor authentication is not enabled yet.
            </Typography>
            <Typography
              sx={{
                mb: 6,
                width: ["100%", "100%", "75%"],
                color: "text.secondary",
              }}
            >
              Two-factor authentication adds an additional layer of security to
              your account by requiring more than just a password to log in.{" "}
              <Box
                href="/"
                component={"a"}
                onClick={(e) => e.preventDefault()}
                sx={{ textDecoration: "none", color: "primary.main" }}
              >
                Learn more.
              </Box>
            </Typography>
            <Button variant="contained" onClick={toggle2FADialog}>
              Enable two-factor authentication
            </Button>
          </CardContent>
        )}
      </Card>

      <Dialog
        fullWidth
        open={open}
        onClose={toggle2FADialog}
        sx={{ "& .MuiDialog-paper": { overflow: "visible" } }}
      >
        <DialogContent
          sx={{
            px: (theme) => [
              `${theme.spacing(5)} !important`,
              `${theme.spacing(15)} !important`,
            ],
            py: (theme) => [
              `${theme.spacing(8)} !important`,
              `${theme.spacing(12.5)} !important`,
            ],
          }}
        >
          <Box sx={{ mb: 12, display: "flex", justifyContent: "center" }}>
            <Typography variant="h5" sx={{ fontSize: "1.625rem" }}>
              Enable One Time Password
            </Typography>
          </Box>

          <CustomCloseButton onClick={close2FADialog}>
            <Icon icon="tabler:x" fontSize="1.25rem" />
          </CustomCloseButton>
          <React.Fragment>
            <Typography sx={{ mt: 4, mb: 6 }}>
              We have a sent a verification code on this number{" "}
              <b>{maskPhoneNumber(currentUser?.phoneNumber || "", 4)}</b>
            </Typography>
          </React.Fragment>
          <Typography sx={{ mt: 4, mb: 6 }}>
            Enter verification code.
          </Typography>
          <form onSubmit={handleSubmit(on2FAFormSubmit)}>
            <Controller
              name="otp"
              control={control}
              rules={{ required: true, minLength: 6, maxLength: 6 }}
              render={({ field: { value, onChange } }) => (
                <CustomTextField
                  fullWidth
                  type="number"
                  value={value}
                  sx={{ mb: 4 }}
                  onChange={onChange}
                  label="OTP"
                  id="opt-phone-number"
                  placeholder="021545"
                  error={Boolean(errors.otp)}
                  {...(errors.otp && {
                    helperText: "Please enter a valid otp",
                  })}
                />
              )}
            />
            <div style={{ marginBottom: "10px" }}>
              <Typography component={LinkStyled} href="#" onClick={getOTP}>
                Resend the verification code?
              </Typography>
            </div>

            <div>
              <Button
                variant="contained"
                type="submit"
                sx={{ mr: 3.5 }}
                disabled={loading}
              >
                Submit
              </Button>
              <Button
                type="reset"
                variant="tonal"
                color="secondary"
                onClick={close2FADialog}
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        fullWidth
        open={openDisableDialog}
        onClose={toggle2FADisableDialog}
        sx={{ "& .MuiDialog-paper": { overflow: "visible" } }}
      >
        <DialogContent
          sx={{
            px: (theme) => [
              `${theme.spacing(5)} !important`,
              `${theme.spacing(15)} !important`,
            ],
            py: (theme) => [
              `${theme.spacing(8)} !important`,
              `${theme.spacing(12.5)} !important`,
            ],
          }}
        >
          <Box sx={{ mb: 12, display: "flex", justifyContent: "center" }}>
            <Typography variant="h5" sx={{ fontSize: "1.625rem" }}>
              Disable One Time Password
            </Typography>
          </Box>

          <CustomCloseButton onClick={toggle2FADisableDialog}>
            <Icon icon="tabler:x" fontSize="1.25rem" />
          </CustomCloseButton>

          <Typography sx={{ mt: 4, mb: 6 }}>
            We have a sent a verification code on this number{" "}
            <b>{maskPhoneNumber(currentUser?.phoneNumber || "", 4)}</b>
          </Typography>
          <Typography sx={{ mt: 4, mb: 6 }}>
            Enter verification code.
          </Typography>

          <form onSubmit={handleSubmit(on2FADisableFormSubmit)}>
            <Controller
              name="otp"
              control={control}
              rules={{ required: true, minLength: 6, maxLength: 6 }}
              render={({ field: { value, onChange } }) => (
                <CustomTextField
                  fullWidth
                  type="number"
                  value={value}
                  sx={{ mb: 4 }}
                  onChange={onChange}
                  label="OTP"
                  id="opt-phone-number"
                  placeholder="021545"
                  error={Boolean(errors.otp)}
                  {...(errors.otp && {
                    helperText: "Please enter a valid otp",
                  })}
                />
              )}
            />
            <div style={{ marginBottom: "10px" }}>
              <Typography component={LinkStyled} href="#" onClick={getOTP}>
                Resend the verification code?
              </Typography>
            </div>
            <div>
              <Button
                variant="contained"
                type="submit"
                sx={{ mr: 3.5 }}
                disabled={loading}
              >
                Submit
              </Button>
              <Button
                type="reset"
                variant="tonal"
                color="secondary"
                onClick={close2FADisableDialog}
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TwoFactor;
