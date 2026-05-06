import React, { useState } from "react";

// ** MUI Components
import Grid from "@mui/material/Grid";

// ** Demo Components
import { Typography, Box, MenuItem, Card } from "@mui/material";
// ** Custom Component Import
import CustomTextField from "src/@core/components/mui/text-field";
// ** Third Party Imports
import * as yup from "yup";
// import toast from "react-hot-toast";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

const defaultValues = {
  userId: "UsamaM",
  email: "usama.mehmood@invozoe.dev",
  fullName: "UsamaMehmood",
  phone: "",
  select: "",
  address: "",
};
const schema = yup.object().shape({
  userId: yup.string().optional(),
  email: yup.string().email().required(),
  phone: yup
    .string()
    .matches(/^\d{3}-\d{3}-\d{4}$/, "Invalid phone number")
    .required("Phone number is required"),
  password: yup
    .string()
    .min(8, (obj) => showErrors("password", obj.value.length, obj.min))
    .required(),
  fullName: yup
    .string()
    .min(3, (obj) => showErrors("fullName", obj.value.length, obj.min))
    .required(),
  address: yup.string().optional("Address is required"),
});

const EditProfile = () => {
  // ** Hook
  const {
    control,
    // handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  //   const handleClickShowPassword = () => {
  //     setState({ ...state, showPassword: !state.showPassword });
  //   };
  //   const onSubmit = () => toast.success("Form Submitted");
  return (
    <>
      <Box>
        <Typography variant="h4">PERSONAL INFORMATION</Typography>
        <Grid container spacing={6} sx={{ py: 4 }}>
          <Grid item xs={12} md={6} lg={3}>
            User ID
          </Grid>
          <Grid item xs={12} md={6} lg={9}>
            <Controller
              name="userId"
              control={control}
              rules={{}}
              render={({ field: { value, onChange } }) => (
                <CustomTextField
                  fullWidth
                  type="userId"
                  value={value}
                  label=""
                  onChange={onChange}
                  error={Boolean(errors.userId)}
                  placeholder="carterleonard@gmail.com"
                  aria-describedby="validation-async-email"
                  InputProps={{
                    readOnly: true,
                  }}
                  {...(errors.userId && { helperText: "This field is required" })}
                />
              )}
            />
          </Grid>
        </Grid>
        <Grid container spacing={6} sx={{ py: 4 }}>
          <Grid item xs={12} md={6} lg={3}>
            Full Name
          </Grid>
          <Grid item xs={12} md={6} lg={9}>
            <Controller
              name="fullName"
              control={control}
              rules={{}}
              render={({ field: { value, onChange } }) => (
                <CustomTextField
                  fullWidth
                  value={value}
                  label=""
                  onChange={onChange}
                  placeholder="Full Name"
                  error={Boolean(errors.fullName)}
                  aria-describedby="validation-schema-first-name"
                  {...(errors.fullName && { helperText: errors.fullName.message })}
                />
              )}
            />
          </Grid>
        </Grid>
      </Box>
      <Box>
        <Typography variant="h4">Contact Info</Typography>
        <Grid container spacing={6} sx={{ py: 4 }}>
          <Grid item xs={12} md={6} lg={3}>
            Email address(required)
          </Grid>
          <Grid item xs={12} md={6} lg={9}>
            <Controller
              name="email"
              control={control}
              rules={{}}
              render={({ field: { value, onChange } }) => (
                <CustomTextField
                  fullWidth
                  type="email"
                  value={value}
                  label=""
                  onChange={onChange}
                  error={Boolean(errors.email)}
                  placeholder=""
                  aria-describedby="validation-schema-email"
                  InputProps={{
                    readOnly: true,
                  }}
                  {...(errors.email && { helperText: errors.email.message })}
                />
              )}
            />
          </Grid>
        </Grid>
        <Grid container spacing={6} sx={{ py: 4 }}>
          <Grid item xs={12} md={6} lg={3}>
            Phone
          </Grid>
          <Grid item xs={12} md={6} lg={9}>
            <Controller
              name="phone"
              control={control}
              rules={{}}
              render={({ field: { value, onChange } }) => (
                <CustomTextField
                  fullWidth
                  value={value}
                  label=""
                  onChange={onChange}
                  placeholder="Phone Number"
                  error={Boolean(errors.phone)}
                  aria-describedby="validation-schema-first-name"
                  {...(errors.phone && { helperText: errors.phone.message })}
                />
              )}
            />
          </Grid>
        </Grid>
        <Grid container spacing={6} sx={{ py: 4 }}>
          <Grid item xs={12} md={6} lg={3}>
            Country
          </Grid>
          <Grid item xs={12} md={6} lg={9}>
            <Controller
              name="select"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <CustomTextField
                  select
                  fullWidth
                  defaultValue=""
                  label=""
                  SelectProps={{
                    value: value,
                    onChange: (e) => onChange(e),
                  }}
                  id="validation-basic-select"
                  error={Boolean(errors.select)}
                  aria-describedby="validation-basic-select"
                  {...(errors.select && { helperText: "This field is required" })}
                >
                  <MenuItem value="UK">UK</MenuItem>
                  <MenuItem value="USA">USA</MenuItem>
                  <MenuItem value="Australia">Australia</MenuItem>
                  <MenuItem value="Germany">Germany</MenuItem>
                </CustomTextField>
              )}
            />
          </Grid>
        </Grid>
        <Grid container spacing={6} sx={{ py: 4 }}>
          <Grid item xs={12} md={6} lg={3}>
            Address
          </Grid>
          <Grid item xs={12} md={6} lg={9}>
            <Controller
              name="address"
              control={control}
              rules={{}}
              render={({ field: { value, onChange } }) => (
                <CustomTextField
                  fullWidth
                  value={value}
                  type="textarea"
                  label=""
                  onChange={onChange}
                  placeholder="Address"
                  error={Boolean(errors.address)}
                  aria-describedby="validation-schema-first-name"
                  {...(errors.address && { helperText: errors.address.message })}
                />
              )}
            />
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default EditProfile;
