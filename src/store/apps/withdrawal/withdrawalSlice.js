// Import necessary libraries and functions
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import api from "src/api/api";

// Define the initial state
const initialState = {
  status: "idle",
  error: null,
  fundsWithdrawal: null, // Added successPayload to store the payload on success
  fundsWithdrawalAmount:null
};

// Create an async thunk function for funds transfer
export const fundsWithdrawal = createAsyncThunk(
  "fundsWithdrawal",
  async (data) => {
    try {
      // Assuming there is a /api/fundsTransfer endpoint for funds transfer
      const response = await api.post(`/withdrawal/`, data);
      return response.data; // This will be stored in state.successPayload on success
    } catch (error) {
      throw error;
    }
  }
);
// // Create an async thunk function for funds transfer
export const fundsWithdrawalAmount = createAsyncThunk(
  "fundsWithdrawalAmount",
  async (id) => {
    try {
      // Assuming there is a /api/fundsTransfer endpoint for funds transfer
      const response = await api.get(`/withdrawal/amount/${id}`);
      return response.data; // This will be stored in state.successPayload on success
    } catch (error) {
      throw error;
    }
  }
);
// Create the fundsTransfer slice
const fundsTransferSlice = createSlice({
  name: "fundsWithdrawal",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fundsWithdrawal.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fundsWithdrawal.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.fundsWithdrawal = action.payload; // Store the payload on success
      })
      .addCase(fundsWithdrawal.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(fundsWithdrawalAmount.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fundsWithdrawalAmount.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.fundsWithdrawalAmount = action.payload; // Store the payload on success
      })
      .addCase(fundsWithdrawalAmount.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

// Export the reducer
export default fundsTransferSlice.reducer;
