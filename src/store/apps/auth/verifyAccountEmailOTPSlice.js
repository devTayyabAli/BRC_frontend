import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { VERIFY_ACCOUNT_EMAIL_OTP_ENDPOINT, VERIFY_ACCOUNT_PHONE_NUMBER_OTP_ENDPOINT } from "src/api/apiEndPoint";
import toast from "react-hot-toast";
import api from "src/api/api";

const initialState = {
  status: "idle",
  error: null,
};

export const verifyEmailOTP = createAsyncThunk(
  "/auth/email/verifyOTP",
  async (userData) => {
    try {
      const response = await api.post(
        VERIFY_ACCOUNT_EMAIL_OTP_ENDPOINT,
        userData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

export const verifyPhoneNumberOTP = createAsyncThunk(
  "/auth/verify-2fa-otp",
  async (userData) => {
    try {
      const response = await api.post(
        VERIFY_ACCOUNT_PHONE_NUMBER_OTP_ENDPOINT,
        userData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

const verifyEmailOTPSlice = createSlice({
  name: "verifyEmailOTP",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(verifyEmailOTP.pending, (state) => {
        state.status = "loading";
      })
      .addCase(verifyEmailOTP.fulfilled, (state, action) => {
        state.status = "succeeded";
      })
      .addCase(verifyEmailOTP.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default verifyEmailOTPSlice.reducer;
