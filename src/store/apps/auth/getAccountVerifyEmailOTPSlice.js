import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { GET_VERIFICATION_CODE_EMAIL_ENDPOINT, GET_VERIFICATION_CODE_PHONE_NUMBER_ENDPOINT } from "src/api/apiEndPoint";
import api from "src/api/api";

const initialState = {
  status: "idle",
  error: null,
};

export const getVerifyEmailOTP = createAsyncThunk(
  "/auth/email/sendOTP",
  async (userData) => {
    try {
      const response = await api.post(
        GET_VERIFICATION_CODE_EMAIL_ENDPOINT,
        userData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

export const getVerifyPhoneNumberOTP = createAsyncThunk(
  "/auth/send-2fa-otp",
  async (userData) => {
    try {
      const response = await api.post(
        GET_VERIFICATION_CODE_PHONE_NUMBER_ENDPOINT,
        userData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

const getVerifyEmailOTPSlice = createSlice({
  name: "getVerifyEmailOTP",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getVerifyEmailOTP.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getVerifyEmailOTP.fulfilled, (state, action) => {
        state.status = "succeeded";
      })
      .addCase(getVerifyEmailOTP.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default getVerifyEmailOTPSlice.reducer;
