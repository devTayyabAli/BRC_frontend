// Import necessary libraries and functions
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import api from "src/api/api";

// Define the initial state
const initialState = {
  status: "idle",
  completeBuyFundsStatus: "idle",
  completeSellFundsStatus: "idle",
  error: null,
  completeBuyFundsError: null,
  completeSellFundsError: null,
  fundsTransfer: null, // Added successPayload to store the payload on success
  buyFunds: null, // Added successPayload to store the payload on success
  sellFunds: null, // Added successPayload to store the payload on success
  completeBuyFunds: null,
  completeSellFunds: null,
};

// Create an async thunk function for funds transfer
export const fundsTransfer = createAsyncThunk("fundsTransfer", async (transferData) => {
  try {
    // Assuming there is a /api/fundsTransfer endpoint for funds transfer
    const response = await api.post("/fundsTransfer", transferData);
    return response.data; // This will be stored in state.successPayload on success
  } catch (error) {
    throw error;
  }
});

export const buyFund = createAsyncThunk("salesExchange", async (buyData) => {
  try {
    
    const response = await api.post("/tokensExchange", buyData);
    return response.data; // This will be stored in state.successPayload on success
  } catch (error) {
    throw error;
  }
});

export const completeBuyFund = createAsyncThunk(
  "completeBuyFund",
  async (buyData) => {
    try {
      const response = await api.post(
        `/tokensExchange/complete/${buyData?.id}`,
        buyData.data
      );
      return response.data; // This will be stored in state.successPayload on success
    } catch (error) {
      throw error;
    }
  }
);

export const sellFund = createAsyncThunk("salesExchangeSellFund", async (sellData) => {
  try {
    const response = await api.post("/tokensExchange", sellData);
    return response.data; // This will be stored in state.successPayload on success
  } catch (error) {
    throw error;
  }
});

export const completeSellFund = createAsyncThunk(
  "completeSellFund",
  async (sellData) => {
    try {
      const response = await api.post(
        `/tokensExchange/complete/${sellData?.id}`,
        sellData.data
      );
      return response.data; // This will be stored in state.successPayload on success
    } catch (error) {
      throw error;
    }
  }
);

export const fundsTransferHistory = createAsyncThunk("fundsTransfer/all", async (data) => {
  try {
    const { userId, page, limit } = data;
    const response = await api.get(`fundsTransfer/all/${userId}`, {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
});

export const sellFundsHistory = createAsyncThunk("tokensExchange/all/sell", async (data) => {
  try {
    const { userId, page, limit } = data;
    const response = await api.get(`tokensExchange/all/${userId}/sell`, {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
});

export const buyFundsHistory = createAsyncThunk("tokensExchange/all/buy", async (data) => {
  try {
    const { userId, page, limit } = data;
    const response = await api.get(`tokensExchange/all/${userId}/buy`, {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
});

export const fundsReceiveHistory = createAsyncThunk("fundsReceive/all", async (data) => {
  try {
    const { userId, page, limit } = data;
    const response = await api.get(`fundsTransfer/all/${userId}`, {
      params: {
        receive: true,
        page,
        limit
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
});

// Create the fundsTransfer slice
const fundsTransferSlice = createSlice({
  name: "fundsTransfer",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fundsTransfer.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fundsTransfer.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.fundsTransfer = action.payload; // Store the payload on success
      })
      .addCase(fundsTransfer.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fundsTransferHistory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fundsTransferHistory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.fundsTransferHistory = action.payload; // Store the payload on success
      })
      .addCase(fundsTransferHistory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fundsReceiveHistory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fundsReceiveHistory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.fundsReceiveHistory = action.payload; // Store the payload on success
      })
      .addCase(fundsReceiveHistory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(buyFundsHistory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(buyFundsHistory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.buyFunds = action.payload; // Store the payload on success
      })
      .addCase(buyFundsHistory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(sellFundsHistory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(sellFundsHistory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.sellFunds = action.payload; // Store the payload on success
      })
      .addCase(sellFundsHistory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(completeBuyFund.pending, (state) => {
        state.completeBuyFundsStatus = "loading";
      })
      .addCase(completeBuyFund.fulfilled, (state, action) => {
        state.completeBuyFundsStatus = "succeeded";
        state.completeBuyFunds = action.payload; // Store the payload on success
      })
      .addCase(completeBuyFund.rejected, (state, action) => {
        state.completeBuyFundsStatus = "failed";
        state.completeBuyFundsError = action.error.message;
      })
      .addCase(completeSellFund.pending, (state) => {
        state.completeSellFundsStatus = "loading";
      })
      .addCase(completeSellFund.fulfilled, (state, action) => {
        state.completeSellFundsStatus = "succeeded";
        state.completeSellFunds = action.payload; // Store the payload on success
      })
      .addCase(completeSellFund.rejected, (state, action) => {
        state.completeSellFundsStatus = "failed";
        state.completeSellFundsError = action.error.message;
      });
  },
});

// Export the reducer
export default fundsTransferSlice.reducer;