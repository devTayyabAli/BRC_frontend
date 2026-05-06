import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import { SIGNIN_ENDPOINT } from "src/api/apiEndPoint";
import defaultAuthConfig from "src/configs/auth";
import api from "src/api/api";
import { toast } from "react-hot-toast";

const initialState = {
  status: "idle",
  error: null,
  user: null,
};

export const loginUser = createAsyncThunk("auth/signin", async (userData) => {
  try {
    const response = await api.post(SIGNIN_ENDPOINT, userData);
    return response.data;
  } catch (error) {
    const { data } = error?.response?.data;
    if (data?.emailVerified === false && data?.email) {
      window?.localStorage?.removeItem("userData");
      window?.localStorage?.setItem("userOTPEmail", data?.email);
      window.location.href = '/verify/account/';
    } else if (data?.is2faEnabled === true  && data?.email) {
      window?.localStorage?.removeItem("userData");
      window?.localStorage?.setItem("userOTPEmail", data?.email);
      window.location.href = '/verify-otp';
    }
    throw error;
  }
});

// Load user data from localStorage
export const loadUserFromLocalStorage = () => {
  const { storageUserDataKeyName } = defaultAuthConfig;
  let userData;
  if (typeof window !== "undefined") {
    userData = localStorage.getItem(storageUserDataKeyName);
  }
  return userData ? JSON.parse(userData) : null;
};

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    resetUser: (state) => {
      state.status = "idle";
      state.error = null;
      state.user = null;
    },
    setUser: (state, action) => {
      state.status = "succeeded";
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { resetUser, setUser } = loginSlice.actions;

export default loginSlice.reducer;
