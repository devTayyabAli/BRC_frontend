import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "src/api/api";
const initialState = {
  status: "idle",
  error: null,
  kycInfo: null,
};

export const kycIno = createAsyncThunk("kyc", async (refId) => {
  try {
    const response = await api.get(`/kyc/user/${refId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
});
// Create the stake slice
const kycSlice = createSlice({
  name: "kyc",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(kycIno.pending, (state) => {
        state.status = "loading";
      })
      .addCase(kycIno.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.kycInfo = action.payload?.data;
      })
      .addCase(kycIno.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

// Export the reducer
export default kycSlice.reducer;
