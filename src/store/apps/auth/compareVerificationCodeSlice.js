import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { COMPARE_VERIFICATION_CODE_ENDPOINT, DISABLE_2FA_ENDPOINT } from "src/api/apiEndPoint";
import api from "src/api/api";

const initialState = {
  status: "idle",
  error: null,
};

export const compareVerificationCode = createAsyncThunk(
  "/auth/verify-2fa",
  async (userData) => {
    const accessToken = localStorage.getItem("accessToken");
    try {
      const response = await api.post(
        COMPARE_VERIFICATION_CODE_ENDPOINT,
        userData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

export const disable2FA = createAsyncThunk(
  "/auth/disable-2fa",
  async (userData) => {
    const accessToken = localStorage.getItem("accessToken");
    try {
      const response = await api.post(
        DISABLE_2FA_ENDPOINT,
        userData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

const compareVerificationCode2FASlice = createSlice({
  name: "compareVerificationCode2FA",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(compareVerificationCode.pending, (state) => {
        state.status = "loading";
      })
      .addCase(compareVerificationCode.fulfilled, (state, action) => {
        state.status = "succeeded";
      })
      .addCase(compareVerificationCode.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default compareVerificationCode2FASlice.reducer;
