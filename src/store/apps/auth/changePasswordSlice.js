// changePasswordSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { CHANGE_PASSWORD_ENDPOINT } from "src/api/apiEndPoint"; // Update the import path
import api from "src/api/api";

const initialState = {
  status: "idle",
  error: null,
  user: null,
};

export const changePasswordUser = createAsyncThunk("auth/change-password", async (passwordData) => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const response = await api.post(CHANGE_PASSWORD_ENDPOINT, passwordData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
});

const changePasswordSlice = createSlice({
  name: "changePassword",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(changePasswordUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(changePasswordUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(changePasswordUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default changePasswordSlice.reducer;
