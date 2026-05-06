import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ACCOUNT_DEACTIVATE_ENDPOINT } from "src/api/apiEndPoint";
import api from "src/api/api";

const initialState = {
  status: "idle",
  user: null,
  error: null,
};

export const getAccountDeactivated = createAsyncThunk(
  "/auth/deactive-account",
  async (data) => {
    const accessToken = localStorage.getItem("accessToken");
    try {
      const response = await api.post(`${ACCOUNT_DEACTIVATE_ENDPOINT}`, data, {
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

const getAccountDeactivatedSlice = createSlice({
  name: "getAccountDeactivated",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAccountDeactivated.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAccountDeactivated.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(getAccountDeactivated.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default getAccountDeactivatedSlice.reducer;
