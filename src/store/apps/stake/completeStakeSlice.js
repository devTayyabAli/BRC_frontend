// Import necessary libraries and functions
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import api from "src/api/api";

// Define the initial state
const initialState = {
  completeStakeStatus: "idle",
  completeStakeError: null,
  completeStake: null,
};

// Create an async thunk function for staking
export const completeStakekGC = createAsyncThunk(
  "completeStake",
  async (stakeData) => {
    try {
      // Assuming there is a /api/stake endpoint for staking
      const response = await api.post(
        `/stake/complete/${stakeData?.id}`,
        stakeData.data
      );
      return response.data; // This will be stored in state.successPayload on success
    } catch (error) {
      throw error;
    }
  }
);

const completeStakeSlice = createSlice({
  name: "completeStake",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      //complete stake
      .addCase(completeStakekGC.pending, (state) => {
        state.completeStakeStatus = "loading";
      })
      .addCase(completeStakekGC.fulfilled, (state, action) => {
        state.completeStakeStatus = "succeeded";
        state.completeStake = action.payload; // Store the payload on success
      })
      .addCase(completeStakekGC.rejected, (state, action) => {
        state.completeStakeStatus = "failed";
        state.completeStakeError = action.error.message;
      });
  },
});

// Export the reducer
export default completeStakeSlice.reducer;
