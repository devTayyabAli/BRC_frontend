// Import necessary libraries and functions
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "src/api/api";

// Define the initial state
const initialState = {
  status: "idle",
  error: null,
  teamDirectReferral: null, // Added successPayload to store the payload on success
  teamDirectActiveReferral: null, // Added successPayload to store the payload on success
  teamDirectPendingReferral: null, // Added successPayload to store the payload on success
  teamDownlineActiveReferral: null, // Added successPayload to store the payload on success
  teamDownlinePendingReferral: null, // Added successPayload to store the payload on success
};

export const teamDirectReferral = createAsyncThunk(
  "teamDirectReferral",
  async (data) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await api.get("/referral", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          type: "direct",
          page: data?.page,
          limit: data?.limit,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

export const teamDirectActiveReferral = createAsyncThunk(
  "teamDirectActiveReferral",
  async (data) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await api.get("/referral", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          type: "directActive",
          page: data?.page,
          limit: data?.limit,
          userName: data?.userName
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

export const teamDirectPendingReferral = createAsyncThunk(
  "teamDirectPendingReferral",
  async (data) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await api.get("/referral", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          type: "directPending",
          page: data?.page,
          limit: data?.limit,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

export const teamDownlineActiveReferral = createAsyncThunk(
  "teamDownlineActiveReferral",
  async (data) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await api.get("/referral", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          type: "downlineActive",
          page: data?.page,
          limit: data?.limit,
          userName: data?.userName
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

export const teamDownlinePendingReferral = createAsyncThunk(
  "teamDownlinePendingReferral",
  async (data) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await api.get("/referral", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          type: "downlinePending",
          page: data?.page,
          limit: data?.limit,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

const teamSlice = createSlice({
  name: "team",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(teamDirectReferral.pending, (state) => {
        state.status = "loading";
      })
      .addCase(teamDirectReferral.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.teamDirectReferral = action.payload; // Store the payload on success
      })
      .addCase(teamDirectReferral.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(teamDirectActiveReferral.pending, (state) => {
        state.status = "loading";
      })
      .addCase(teamDirectActiveReferral.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.teamDirectActiveReferral = action.payload; // Store the payload on success
      })
      .addCase(teamDirectActiveReferral.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(teamDirectPendingReferral.pending, (state) => {
        state.status = "loading";
      })
      .addCase(teamDirectPendingReferral.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.teamDirectPendingReferral = action.payload; // Store the payload on success
      })
      .addCase(teamDirectPendingReferral.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(teamDownlineActiveReferral.pending, (state) => {
        state.status = "loading";
      })
      .addCase(teamDownlineActiveReferral.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.teamDownlineActiveReferral = action.payload; // Store the payload on success
      })
      .addCase(teamDownlineActiveReferral.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(teamDownlinePendingReferral.pending, (state) => {
        state.status = "loading";
      })
      .addCase(teamDownlinePendingReferral.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.teamDownlinePendingReferral = action.payload; // Store the payload on success
      })
      .addCase(teamDownlinePendingReferral.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

// Export the reducer
export default teamSlice.reducer;
