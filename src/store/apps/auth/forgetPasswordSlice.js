import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { FORGET_PASSWORD_ENDPOINT } from "src/api/apiEndPoint";
import api from "src/api/api";

const initialState = {
  status: "idle",
  error: null,
};

export const forgetPasswordUser = createAsyncThunk("auth/forget-password", async (userData) => {
  try {
    const response = await api.post(FORGET_PASSWORD_ENDPOINT, userData);
    return response.data;
  } catch (error) {
    throw error;
  }
});

const forgetPasswordSlice = createSlice({
  name: "forgetPassword",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(forgetPasswordUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(forgetPasswordUser.fulfilled, (state, action) => {
        state.status = "succeeded";
      })
      .addCase(forgetPasswordUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default forgetPasswordSlice.reducer;