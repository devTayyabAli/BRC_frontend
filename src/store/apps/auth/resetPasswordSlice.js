// resetPasswordSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RESET_PASSWORD_ENDPOINT } from "src/api/apiEndPoint"; // Update the import path
import api from "src/api/api";

const initialState = {
  status: "idle",
  error: null,
  user: null,
};

export const resetPasswordUser = createAsyncThunk(
  "auth/reset-password",
  async (resetPasswordData) => {
    try {
      const { resetToken, ...requestData } = resetPasswordData;
      const response = await api.post(
        `${RESET_PASSWORD_ENDPOINT}/${resetToken}`,
        requestData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

const resetPasswordSlice = createSlice({
  name: "resetPassword",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(resetPasswordUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(resetPasswordUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(resetPasswordUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default resetPasswordSlice.reducer;