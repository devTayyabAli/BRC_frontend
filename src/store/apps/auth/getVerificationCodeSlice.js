import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { GET_VERIFICATION_CODE_ENDPOINT } from "src/api/apiEndPoint";
import api from "src/api/api";

const initialState = {
  status: "idle",
  error: null,
};

export const getVerificationCode = createAsyncThunk(
  "/auth/generate-2fa",
  async (userData) => {
    const accessToken = localStorage.getItem("accessToken");
    try {
      const response = await api.post(
        GET_VERIFICATION_CODE_ENDPOINT,
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

const getVerificationCode2FASlice = createSlice({
  name: "getVerificationCode2FA",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getVerificationCode.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getVerificationCode.fulfilled, (state, action) => {
        state.status = "succeeded";
      })
      .addCase(getVerificationCode.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default getVerificationCode2FASlice.reducer;
