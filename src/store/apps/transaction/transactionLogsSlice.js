import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "src/api/api";
const initialState = {
  status: "idle",
  error: null,
  kycInfo: null,
};

export const createTxLog = createAsyncThunk("txLog", async (data) => {
  try {
    const response = await api.post(`/transaction/log/`,data);
    return response.data;
  } catch (error) {
    throw error;
  }
});
// Create the stake slice
const txLogSlice = createSlice({
  name: "txLog",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createTxLog.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createTxLog.fulfilled, (state, action) => {
        state.status = "succeeded";
      })
      .addCase(createTxLog.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

// Export the reducer
export default txLogSlice.reducer;
