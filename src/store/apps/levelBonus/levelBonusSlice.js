import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  LEVEL_BONUS_ENDPOINT,
  REFERRAL_STATS_ENDPOINT,
} from "src/api/apiEndPoint";
import api from "src/api/api";

const initialState = {
  status: "idle",
  error: null,
  levelBonus: null,
  referralStats: null,
};

export const getLevelBonus = createAsyncThunk(
  "referral/level-bonus",
  async (data) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await api.get(LEVEL_BONUS_ENDPOINT, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);
export const getReferralStats = createAsyncThunk(
  "referral/stats",
  async (data) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await api.get(REFERRAL_STATS_ENDPOINT, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

const levelBonusSlice = createSlice({
  name: "levelBonus",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getLevelBonus.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getLevelBonus.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.levelBonus = action.payload;
      })
      .addCase(getLevelBonus.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(getReferralStats.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getReferralStats.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.referralStats = action.payload;
      })
      .addCase(getReferralStats.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default levelBonusSlice.reducer;
