// Import necessary libraries and functions
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "src/api/api";

// Define the initial state
const initialState = {
  status: "idle",
  error: null,
  leadershipBonusData: null, // Added successPayload to store the payload on success
  referralIncomeBonusData: null,
  stakingRewardBonusData: null,
  rankData: null,
  instantBonus: null,
};

export const getLeadershipBonusData = createAsyncThunk(
  "getLeadershipBonusData",
  async (data) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await api.get("/referral/leadership-bonus", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          page: data?.page,
          limit: data?.limit,
        },
      });
      return response?.data;
    } catch (error) {
      throw error;
    }
  }
);

export const getReferralIncomeBonusData = createAsyncThunk(
  "getReferralIncomeBonusData",
  async (data) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await api.get("/referral/level-bonus", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          page: data?.page,
          limit: data?.limit,
        },
      });
      return response?.data;
    } catch (error) {
      throw error;
    }
  }
);

export const getStakingRewardBonusData = createAsyncThunk(
  "getStakingRewardBonusData",
  async (data) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await api.get("/referral/stake-bonus", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          page: data?.page,
          limit: data?.limit,
        },
      });
      return response?.data;
    } catch (error) {
      throw error;
    }
  }
);

export const getRankData = createAsyncThunk(
  "getRankData",
  async (userId) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await api.get(`/rank/${userId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response?.data;
    } catch (error) {
      throw error;
    }
  }
);

export const getInstantBonus = createAsyncThunk(
  "getInstantBonus",
  async (params, thunkAPI) => {
    try {
      const token = thunkAPI.getState().login.user.data.token;
        const response = await api.get("/referral/instant-bonus", {
        params,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);


const bonusSlice = createSlice({
  name: "bonus",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getLeadershipBonusData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getLeadershipBonusData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.leadershipBonusData = action.payload; // Store the payload on success
      })
      .addCase(getLeadershipBonusData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(getReferralIncomeBonusData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getReferralIncomeBonusData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.referralIncomeBonusData = action.payload; // Store the payload on success
      })
      .addCase(getReferralIncomeBonusData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(getStakingRewardBonusData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getStakingRewardBonusData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.stakingRewardBonusData = action.payload; // Store the payload on success
      })
      .addCase(getStakingRewardBonusData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(getRankData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getRankData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.rankData = action.payload; // Store the payload on success
      })
      .addCase(getRankData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(getInstantBonus.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getInstantBonus.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.instantBonus = action.payload;
      })
      .addCase(getInstantBonus.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

// Export the reducer
export default bonusSlice.reducer;