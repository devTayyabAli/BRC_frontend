// Import necessary libraries and functions
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "src/api/api";

// Define the initial state
const initialState = {
  status: "idle",
  error: null,
  completeFundsWithdrawal: null, // Added successPayload to store the payload on success
};

// Create an async thunk function for funds transfer
export const completeFundsWithdrawal = createAsyncThunk(
  "completeFundsWithdrawal",
  async (payload) => {
    try {
      // Assuming there is a /api/fundsTransfer endpoint for funds transfer
      const response = await api.post(`/withdrawal/complete/${payload.id}`, payload?.data);
      return response.data; // This will be stored in state.successPayload on success
    } catch (error) {
      throw error;
    }
  }
);

// Create the fundsTransfer slice
const fundsTransferSlice = createSlice({
  name: "completeFundsWithdrawal",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(completeFundsWithdrawal.pending, (state) => {
        state.status = "loading";
      })
      .addCase(completeFundsWithdrawal.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.completeFundsWithdrawal = action.payload; // Store the payload on success
      })
      .addCase(completeFundsWithdrawal.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

// Export the reducer
export default fundsTransferSlice.reducer;
