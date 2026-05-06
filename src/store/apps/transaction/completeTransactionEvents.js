// Import necessary libraries and functions
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "src/api/api";

// Define the initial state
const initialState = {
  status: "idle",
  error: null,
  completeStackTx:null,
  completeP2PTx:null,
  completeWithdrawTx:null,
  completeBuyFundTx:null,
  completeSellFundTx:null,
  availableAmountToConvert:null
};

// Create an async thunk function for funds transfer
export const completeStack = createAsyncThunk("stack", async (txHash) => {
  try {
    // Assuming there is a /api/fundsTransfer endpoint for funds transfer
    const response = await api.post(`/transaction/stake/${txHash}`);
    return response.data; // This will be stored in state.successPayload on success
  } catch (error) {
    throw error;
  }
});

export const completeBuyFundEvent = createAsyncThunk("salesExchangeBuyFund", async (txHash) => {
  try {
    const response = await api.post(`/tokensExchange/complete-exchangeTx/${txHash}`);
    return response.data; // This will be stored in state.successPayload on success
  } catch (error) {
    throw error;
  }
});

export const completeSellFundEvent = createAsyncThunk("salesExchangeSellFund", async (txHash) => {
  try {
    const response = await api.post(`/tokensExchange/complete-exchangeTx/${txHash}`);
    return response.data; // This will be stored in state.successPayload on success
  } catch (error) {
    throw error;
  }
});

export const completeP2P = createAsyncThunk("p2p", async (txHash) => {
  try {
    const response = await api.post(`/transaction/p2p/${txHash}`);
    return response.data;
  } catch (error) {
    throw error;
  }
});

export const completeWithdraw = createAsyncThunk("withdraw", async (txHash) => {
  try {
    const response = await api.post(`/transaction/withdraw/${txHash}`);
    return response.data;
  } catch (error) {
    throw error;
  }
});
export const completeRegister = createAsyncThunk("register", async (txHash) => {
  try {
    const response = await api.post(`/transaction/register/${txHash}`);
    return response.data;
  } catch (error) {
    throw error;
  }
});
export const availableToConvert = createAsyncThunk("getToken", async (userId) => {
  try {
    const response = await api.get(`/fundsTransfer/availableToConvert/${userId}`);
    return response?.data?.data;
  } catch (error) {
    throw error;
  }
});

// Create the fundsTransfer slice
const completeTransactionEvent = createSlice({
  name: "completeTransactionEvent",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(completeStack.pending, (state) => {
        state.status = "loading";
      })
      .addCase(completeStack.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.completeStackTx = action.payload; // Store the payload on success
      })
      .addCase(completeStack.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(completeP2P.pending, (state) => {
        state.status = "loading";
      })
      .addCase(completeP2P.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.completeP2PTx = action.payload; // Store the payload on success
      })
      .addCase(completeP2P.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(completeWithdraw.pending, (state) => {
        state.status = "loading";
      })
      .addCase(completeWithdraw.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.completeWithdrawTx = action.payload; // Store the payload on success
      })
      .addCase(completeWithdraw.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(completeBuyFundEvent.pending, (state) => {
        state.status = "loading";
      })
      .addCase(completeBuyFundEvent.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.completeBuyFundTx = action.payload; // Store the payload on success
      })
      .addCase(completeBuyFundEvent.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(completeSellFundEvent.pending, (state) => {
        state.status = "loading";
      })
      .addCase(completeSellFundEvent.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.completeSellFundTx = action.payload; // Store the payload on success
      })
      .addCase(completeSellFundEvent.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(availableToConvert.pending, (state) => {
        state.status = "loading";
      })
      .addCase(availableToConvert.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.availableAmountToConvert = action.payload; // Store the payload on success
      })
      .addCase(availableToConvert.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

// Export the reducer
export default completeTransactionEvent.reducer;
