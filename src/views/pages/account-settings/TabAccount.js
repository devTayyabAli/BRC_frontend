// ** React Imports
import { useEffect, useState } from "react";

// ** MUI Imports
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Dialog from "@mui/material/Dialog";
import Divider from "@mui/material/Divider";
import { styled, useTheme } from "@mui/material/styles";
import Checkbox from "@mui/material/Checkbox";
import Typography from "@mui/material/Typography";
import CardHeader from "@mui/material/CardHeader";
import FormControl from "@mui/material/FormControl";
import CardContent from "@mui/material/CardContent";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import FormHelperText from "@mui/material/FormHelperText";
import InputAdornment from "@mui/material/InputAdornment";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import IconButton from "@mui/material/IconButton";

import { Select, MenuItem } from "@mui/material";

// context import
import { useAuth } from "src/hooks/useAuth";

// ** Custom Component Import
import CustomTextField from "src/@core/components/mui/text-field";

// ** Third Party Imports
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-hot-toast";

import { countryCodesList } from "src/constants/conuntryCodeList";

// ** Icon Imports
import Icon from "src/@core/components/icon";
import ChangePassword from "../user-profile/ChangePassword";

// Redux imports
import { useDispatch, useSelector } from "react-redux";
import { getAccountDeactivated } from "src/store/apps/auth/accountDeactivateSlice";
import { updateCurrentUser } from "src/store/apps/auth/currentUserSlice";

// Formik imports
import { Formik, Field, Form } from "formik";
import * as yup from "yup";
import ReferralLinks from "src/views/dashboards/analytics/referralLink";
import AccountDetails from "src/views/dashboards/analytics/AccountDetails";

const schema = yup.object().shape({
  password: yup.string().required("Password is required"),
});

const ImgStyled = styled("img")(({ theme }) => ({
  width: 100,
  height: 100,
  marginRight: theme.spacing(6),
  borderRadius: theme.shape.borderRadius,
}));

const ButtonStyled = styled(Button)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    width: "100%",
    textAlign: "center",
  },
}));

const TabAccount = () => {
  // ** State
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+92");
  const [editProfileErrors, setEditProfileErrors] = useState({
    name: null,
    phoneNumber: null,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [imgSrc, setImgSrc] = useState(null);
  const [editProfileLoading, setEditProfileLoading] = useState(false);
  const theme = useTheme();
  const dispatch = useDispatch();
  const { logout } = useAuth();
  const { spacing } = theme;

  const currentUser = useSelector((state) => state?.getCurrentUser?.user?.data);

  useEffect(() => {
    setName(currentUser?.name);
    setImgSrc(currentUser?.profilePicture);
    setPhoneNumber(currentUser?.phoneNumber);
    const countryCodeFromNumber = countryCodesList?.find((code) =>
      currentUser?.phoneNumber?.startsWith(code?.code)
    );
    if (countryCodeFromNumber) {
      setCountryCode(countryCodeFromNumber?.code);
      setPhoneNumber(currentUser?.phoneNumber?.replace(countryCodeFromNumber?.code, ""));
    }
  }, [currentUser]);

  const initialValues = {
    password: "",
  };

  // ** Hooks
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { checkbox: false } });

  const handleClose = () => {
    setOpen(false);
  };

  const onSubmit = () => setOpen(true);

  const handleConfirmation = async (values) => {
    const { password } = values;
    try {
      setPasswordLoading(true);
      const response = await dispatch(getAccountDeactivated({ password }));
      if (response?.meta?.requestStatus === "fulfilled") {
        const { message } = response.payload;
        toast.success(`${message}`, {
          duration: 5000,
        });
        handleClose();
        logout();
      }
    } catch (error) {
      console.error("[ACCOUNT_DEACTIVATE_ERROR]", error);
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleInputImageChange = (file) => {
    const reader = new FileReader();
    const { files } = file.target;
    if (files && files.length !== 0) {
      setSelectedImage(files[0]);
      reader.onload = () => setImgSrc(reader.result);
      reader.readAsDataURL(files[0]);
    }
  };

  const handleChangeCountryCode = (event) => {
    setCountryCode(event?.target?.value);
  };

  const handleUpdateUserProfile = async () => {
    if (!handleNameValidation() || !handlePhoneNumberValidation()) {
      return;
    }
    try {
      setEditProfileLoading(true);
      const payload = {
        id: currentUser._id,
        name: name,
        profilePicture: selectedImage,
        phoneNumber: countryCode + phoneNumber,
      };
      const response = await dispatch(updateCurrentUser(payload));
      if (response?.meta?.requestStatus === "fulfilled") {
        const { message } = response.payload;
        toast.success(`${message}`, {
          duration: 5000,
        });
      }
    } catch (error) {
      console.error("[ACCOUNT_UPDATE_ERROR]", error);
    } finally {
      setEditProfileLoading(false);
    }
  };

  const handleNameValidation = () => {
    const regexp = /^\s*\S[\s\S]*$/;
    let isValidated = true;
    if (name.length === 0) {
      setEditProfileErrors({
        ...editProfileErrors,
        name: "Name is required",
      });
      isValidated = false;
    }
    if (!regexp.test(name)) {
      setEditProfileErrors({
        ...editProfileErrors,
        name: "Name should not contain only whitespace characters.",
      });
      isValidated = false;
    }
    if (name.length >= 100) {
      setEditProfileErrors({
        ...editProfileErrors,
        name: "Name field has a limit of max 100 characters.",
      });
      isValidated = false;
    }
    return isValidated;
  };

  const handlePhoneNumberValidation = () => {
    const regexp = /^((\+[\d]{1,4}[ \-]*)|(\([0-9]{2,3}\)[ \-]*)|([0-9]{2,4})[ \-]*)*?[0-9]{3,4}?[ \-]*[0-9]{3,4}?$/;
    let isValidated = true;
    if (phoneNumber?.length > 0 && !regexp.test(phoneNumber)) {
      setEditProfileErrors({
        ...editProfileErrors,
        phoneNumber: "Enter a valid phone number",
      });
      isValidated = false;
    }
    return isValidated;
  };

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title="Edit Profile" />
          <form>
            <CardContent sx={{ pt: 0 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <ImgStyled
                  src={imgSrc || "/images/avatars/15.png"}
                  alt="Profile Pic"
                />
                <div>
                  <ButtonStyled
                    component="label"
                    variant="contained"
                    htmlFor="account-settings-upload-image"
                  >
                    Upload New Photo
                    <input
                      hidden
                      type="file"
                      accept="image/png, image/jpeg"
                      onChange={handleInputImageChange}
                      id="account-settings-upload-image"
                    />
                  </ButtonStyled>
                  <Typography sx={{ mt: 4, color: "text.disabled" }}>
                    Allowed types PNG or JPEG of upto 30MB.
                  </Typography>
                </div>
              </Box>
            </CardContent>
            <Divider />
            <CardContent>
              <Grid container spacing={5}>
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    fullWidth
                    label="Name"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setEditProfileErrors({
                        ...editProfileErrors,
                        name: null,
                      });
                    }}
                    onBlur={handleNameValidation}
                  />
                  {editProfileErrors.name && (
                    <p style={{ fontSize: "0.8125rem", color: "#EA5455" }}>
                      {editProfileErrors.name}
                    </p>
                  )}
                </Grid>
              </Grid>
              <Grid container spacing={5} sx={{ marginTop: "10px" }}>
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    fullWidth
                    label="Phone Number"
                    id="auth-login-v2-password"
                    type="string"
                    sx={{ mb: 4 }}
                    placeholder="Phone Number"
                    value={phoneNumber}
                    onChange={(e) => {
                      setPhoneNumber(e.target.value);
                      setEditProfileErrors({
                        ...editProfileErrors,
                        phoneNumber: null,
                      });
                    }}
                    onBlur={handlePhoneNumberValidation}
                    InputProps={{
                      startAdornment: (
                        <Select
                          style={{
                            borderWidth: "0px",
                            width: "75px",
                            paddingLeft: 0,
                          }}
                          value={countryCode}
                          onChange={handleChangeCountryCode}
                        >
                          {countryCodesList?.map((country) => (
                            <MenuItem
                              key={country?.code}
                              value={country?.code}
                              size="small"
                            >
                              {country?.code}
                            </MenuItem>
                          ))}
                        </Select>
                      ),
                    }}
                  />
                  {editProfileErrors.phoneNumber && (
                    <p style={{ fontSize: "0.8125rem", color: "#EA5455" }}>
                      {editProfileErrors.phoneNumber}
                    </p>
                  )}
                </Grid>
                <Grid
                  item
                  xs={12}
                  sx={{ pt: (theme) => `${theme.spacing(6.5)} !important` }}
                >
                  <Button
                    disabled={editProfileLoading}
                    variant="contained"
                    sx={{ mr: 4 }}
                    onClick={handleUpdateUserProfile}
                  >
                    Save Changes
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </form>
        </Card>
      </Grid>


      {/* Change Password Card */}

      <Grid item xs={12}>
        <Card>
          <CardHeader title="Change Password" />
          <ChangePassword />
        </Card>
      </Grid>

      {/* Delete Account Card */}
      <Grid item xs={12}>
        <Card>
          <CardHeader title="Delete Account" />
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Box sx={{ mb: 4 }}>
                <FormControl>
                  <Controller
                    name="checkbox"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <FormControlLabel
                        label="I confirm my account deactivation"
                        sx={{
                          "& .MuiTypography-root": {
                            color: errors.checkbox
                              ? "error.main"
                              : "text.secondary",
                          },
                        }}
                        control={
                          <Checkbox
                            {...field}
                            size="small"
                            name="validation-basic-checkbox"
                            sx={
                              errors.checkbox ? { color: "error.main" } : null
                            }
                          />
                        }
                      />
                    )}
                  />
                  {errors.checkbox && (
                    <FormHelperText
                      id="validation-basic-checkbox"
                      sx={{
                        mx: 0,
                        color: "error.main",
                        fontSize: (theme) => theme.typography.body2.fontSize,
                      }}
                    >
                      Please confirm you want to delete account
                    </FormHelperText>
                  )}
                </FormControl>
              </Box>
              <Button
                variant="contained"
                color="error"
                type="submit"
                disabled={errors.checkbox !== undefined}
              >
                Deactivate Account
              </Button>
            </form>
          </CardContent>
        </Card>
      </Grid>

      {/* Deactivate Account Dialogs */}
      <Dialog fullWidth maxWidth="xs" open={open} onClose={handleClose}>
        <Formik
          initialValues={initialValues}
          validationSchema={schema}
          onSubmit={handleConfirmation}
        >
          <Form>
            <DialogContent
              sx={{
                pb: (theme) => `${theme.spacing(6)} !important`,
                px: (theme) => [
                  `${theme.spacing(5)} !important`,
                  `${theme.spacing(15)} !important`,
                ],
                pt: (theme) => [
                  `${theme.spacing(8)} !important`,
                  `${theme.spacing(12.5)} !important`,
                ],
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  textAlign: "center",
                  alignItems: "center",
                  flexDirection: "column",
                  justifyContent: "center",
                  "& svg": { mb: 6, color: "warning.main" },
                }}
              >
                <Typography>Please enter your password.</Typography>
              </Box>

              <Box sx={{ mb: spacing(4), mt: spacing(6) }}>
                <Field name="password">
                  {({ field, meta }) => (
                    <CustomTextField
                      fullWidth
                      {...field}
                      label="Password*"
                      id="auth-login-v2-password"
                      error={Boolean(meta.touched && meta.error)}
                      helperText={meta.touched && meta.error ? meta.error : ""}
                      type={showPassword ? "text" : "password"}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              edge="end"
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              <Icon
                                fontSize="1.25rem"
                                icon={
                                  showPassword ? "tabler:eye" : "tabler:eye-off"
                                }
                              />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                </Field>
              </Box>
            </DialogContent>
            <DialogActions
              sx={{
                justifyContent: "center",
                px: (theme) => [
                  `${theme.spacing(5)} !important`,
                  `${theme.spacing(15)} !important`,
                ],
                pb: (theme) => [
                  `${theme.spacing(8)} !important`,
                  `${theme.spacing(12.5)} !important`,
                ],
              }}
            >
              <Button
                type="submit"
                variant="contained"
                sx={{ mr: 2 }}
                disabled={passwordLoading}
              >
                Submit
              </Button>
              <Button
                variant="tonal"
                color="secondary"
                onClick={() => handleClose()}
              >
                Cancel
              </Button>
            </DialogActions>
          </Form>
        </Formik>
      </Dialog>
    </Grid>
  );
};

export default TabAccount;
