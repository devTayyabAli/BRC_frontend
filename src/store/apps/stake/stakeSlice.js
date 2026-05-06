import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import api from "src/api/api";

const initialState = {
  status: "idle",
  error: null,
  stake: null, 
  stakeHistory: null,
  completeStakeStatus: "idle",
  completeStakeError: null,
  completeStake: null,
};

export const stakeKGC = createAsyncThunk("stake", async (stakeData) => {
  try {
    const response = await api.post("/stake", stakeData);
    return response.data;
  } catch (error) {
    throw error;
  }
});

export const getStakeKGCHistory = createAsyncThunk("stakeHistory", async (data) => {
  try {
    const { userId, page, limit } = data;
    const response = await api.get(`/stake/all/${userId}`, {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
});


// Create the stake slice
const stakeSlice = createSlice({
  name: "stake",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(stakeKGC.pending, (state) => {
        state.status = "loading";
      })
      .addCase(stakeKGC.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.stake = action.payload; 
      })
      .addCase(stakeKGC.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(getStakeKGCHistory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getStakeKGCHistory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.stakeHistory = action.payload;
      })
      .addCase(getStakeKGCHistory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

// Export the reducer
export default stakeSlice.reducer;
