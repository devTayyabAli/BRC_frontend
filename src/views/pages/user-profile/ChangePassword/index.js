import React, { useState } from "react";

// ** MUI Components
import Grid from "@mui/material/Grid";

// ** Demo Components
import {
  Box,
  Button,
  CardContent,
  IconButton,
  InputAdornment,
} from "@mui/material";
// ** Custom Component Import
import CustomTextField from "src/@core/components/mui/text-field";
// ** Third Party Imports
import * as yup from "yup";
// import toast from "react-hot-toast";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { changePasswordUser } from "src/store/apps/auth/changePasswordSlice";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import Icon from "src/@core/components/icon";

const defaultValues = {
  oldPassword: "",
  password: "",
  confirmPassword: "",
};
const schema = yup.object().shape({
  oldPassword: yup.string().required("Old Password is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/,
      "Password must include at least one capital letter, one digit, and one special character"
    )
    .required("New Password is required"),
  confirmPassword: yup
    .string()
    .oneOf(
      [yup.ref("password"), null],
      "Confirm password must match with new password"
    )
    .required("Confirm Password is required"),
});

const ChangePassword = () => {
  const dispatch = useDispatch();
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // ** Hook
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const { confirmPassword, ...requestData } = data;
      const response = await dispatch(changePasswordUser(requestData));
      if (response?.meta?.requestStatus === "fulfilled") {
        const { message } = response.payload;
        toast.success(`${message}`, {
          duration: 5000,
        });
        return;
      }
      toast.error(`${"Old Password is incorrect"}`, {
        duration: 5000,
      });
    } catch (error) {
      console.error("Something went wrong:", error);
    }
  };

  return (
    <CardContent>
      <Grid container spacing={5}>
        <Grid item xs={12} sm={6}>
          <Controller
            name="oldPassword"
            control={control}
            rules={{}}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                fullWidth
                value={value}
                label="Old password"
                type={showOldPassword ? "text" : "password"}
                onChange={onChange}
                error={Boolean(errors.oldPassword)}
                placeholder="Old Password"
                aria-describedby="validation-async-email"
                {...(errors.oldPassword && {
                  helperText: errors.oldPassword.message,
                })}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => setShowOldPassword(!showOldPassword)}
                      >
                        <Icon
                          fontSize="1.25rem"
                          icon={
                            showOldPassword ? "tabler:eye" : "tabler:eye-off"
                          }
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
        </Grid>
      </Grid>
      <Grid container spacing={5} sx={{ marginTop: "10px" }}>
        <Grid item xs={12} sm={6}>
          <Controller
            name="password"
            control={control}
            rules={{}}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                fullWidth
                value={value}
                label="New password"
                type={showNewPassword ? "text" : "password"}
                onChange={onChange}
                placeholder="New Password"
                error={Boolean(errors.password)}
                aria-describedby="validation-schema-first-name"
                {...(errors.password && {
                  helperText: errors.password.message,
                })}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        <Icon
                          fontSize="1.25rem"
                          icon={
                            showNewPassword ? "tabler:eye" : "tabler:eye-off"
                          }
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
          <Box sx={{ color: "#f16d75", fontSize: 13, pt: 4 }}>
            Important note : Keep your account password safe & secure, do not
            share with any one.
            <Box sx={{ color: "#f16d75", fontSize: 13 }}>
              Strong Password like this BRC@token.0x9#
            </Box>
          </Box>
        </Grid>
      </Grid>
      <Grid container spacing={5} sx={{ marginTop: "10px" }}>
        <Grid item xs={12} sm={6}>
          <Controller
            name="confirmPassword"
            control={control}
            rules={{}}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                fullWidth
                value={value}
                label="Confirm password"
                type={showConfirmPassword ? "text" : "password"}
                onChange={onChange}
                placeholder="Confirm New Password"
                error={Boolean(errors.confirmPassword)}
                aria-describedby="validation-schema-confirm-password"
                {...(errors.confirmPassword && {
                  helperText: errors.confirmPassword.message,
                })}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        <Icon
                          fontSize="1.25rem"
                          icon={
                            showConfirmPassword
                              ? "tabler:eye"
                              : "tabler:eye-off"
                          }
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
        </Grid>
        <Grid
          item
          xs={12}
          sx={{ pt: (theme) => `${theme.spacing(6.5)} !important` }}
        >
          <Button
            onClick={handleSubmit(onSubmit)}
            variant="contained"
            sx={{ mr: 4 }}
          >
            Submit
          </Button>
        </Grid>
      </Grid>
    </CardContent>
  );
};

export default ChangePassword;
