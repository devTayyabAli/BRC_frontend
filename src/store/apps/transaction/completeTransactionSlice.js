// Import necessary libraries and functions
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "src/api/api";

// Define the initial state
const initialState = {
  status: "idle",
  error: null,
 completeFundsTransfer: null, // Added successPayload to store the payload on success
};

// Create an async thunk function for funds transfer
export const completeFundsTransfer = createAsyncThunk("completeTransfer", async (payload) => {
  try {
    // Assuming there is a /api/fundsTransfer endpoint for funds transfer
    const response = await api.post(`/fundsTransfer/complete/${payload?.id}`, payload.data);
    return response.data; // This will be stored in state.successPayload on success
  } catch (error) {
    throw error;
  }
});

// Create the fundsTransfer slice
const fundsTransferSlice = createSlice({
  name: "completeTransfer",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(completeFundsTransfer.pending, (state) => {
        state.status = "loading";
      })
      .addCase(completeFundsTransfer.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.completeFundsTransfer = action.payload; // Store the payload on success
      })
      .addCase(completeFundsTransfer.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

// Export the reducer
export default fundsTransferSlice.reducer;