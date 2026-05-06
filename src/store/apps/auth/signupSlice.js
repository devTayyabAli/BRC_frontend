import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import { SIGNUP_ENDPOINT, SIGNUP_COMPLETE_ENDPOINT ,DELETE_PENDINGUSER_ENDPOINT} from "src/api/apiEndPoint";
import api from "src/api/api";
import { toast } from "react-hot-toast";

const initialState = {
  status: "idle",
  error: null,
  user: null,
};

export const registerUser = createAsyncThunk(
  "auth/signup",
  async (userData) => {
    try {
      const response = await api.post(SIGNUP_ENDPOINT, userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

export const completeSignup = createAsyncThunk(
  "auth/signup/complete",
  async (userData) => {
    try {
      const response = await api.post(SIGNUP_COMPLETE_ENDPOINT, userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);
export const deletePendingUser = createAsyncThunk(
  "auth/pending",
  async (id) => {
    try {
      const response = await api.delete(`${DELETE_PENDINGUSER_ENDPOINT}/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

export const resetSignupState = createAction("auth/resetSignupState");

const signupSlice = createSlice({
  name: "signup",
  initialState,
  reducers: {
    resetSignupState: (state) => {
      state.status = "idle";
      state.error = null;
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload?.data;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default signupSlice.reducer;
