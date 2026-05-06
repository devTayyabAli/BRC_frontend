import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  GET_CURRENT_USER_ENDPOINT,
  UPDATE_CURRENT_USER_ENDPOINT,
} from "src/api/apiEndPoint";
import api from "src/api/api";
import { toast } from "react-hot-toast";

const initialState = {
  status: "idle",
  user: null,
  error: null,
};

export const getCurrentUser = createAsyncThunk(
  "/auth/profile/:id",
  async (id) => {
    const accessToken = localStorage.getItem("accessToken");
    try {
      const response = await api.get(`/auth/profile/${id}`, {
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

export const updateCurrentUser = createAsyncThunk(
  "/auth/update-profile/:id",
  async (data) => {
    const accessToken = localStorage.getItem("accessToken");
    try {
      const { id, name, profilePicture, phoneNumber } = data;
      const formData = new FormData();
      formData.append("profilePicture", profilePicture);
      formData.append("name", name);
      formData.append("phoneNumber", phoneNumber);
      const response = await api.post(
        `${UPDATE_CURRENT_USER_ENDPOINT}/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

const getCurrentUserSlice = createSlice({
  name: "getCurrentUser",
  initialState,
  reducers: {
    resetCurrentUser: (state) => {
      state.status = "idle";
      state.error = null;
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCurrentUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
    builder
      .addCase(updateCurrentUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateCurrentUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user.data = action.payload.data;
      })
      .addCase(updateCurrentUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { resetCurrentUser } = getCurrentUserSlice.actions;

export default getCurrentUserSlice.reducer;
