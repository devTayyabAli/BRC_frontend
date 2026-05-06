import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import { SIGNUP_ENDPOINT, SIGNUP_COMPLETE_ENDPOINT ,DELETE_PENDINGUSER_ENDPOINT, CREATE_SUPPORT_TICKET_ENDPOINT} from "src/api/apiEndPoint";
import api from "src/api/api";
import { toast } from "react-hot-toast";
import axios from "axios";

const initialState = {
  status: "idle",
  loading:false,
  error: null,
  user: null,
  editSupportTicketValue:[],
  allTickets:[],
  getSupportTicketsByUserIdValue:[],
  deleteSupportTicketsByIdValue:[],
  getNewsBannerValue:[]
};

export const createSupportTicket = createAsyncThunk(
  "support/create",
  async (ticketData, { rejectWithValue }) => {
    try {
      const response = await api.post(CREATE_SUPPORT_TICKET_ENDPOINT, ticketData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);


export const editSupportTicket = createAsyncThunk(
  "support/edit",
  async ({ id, ticketData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`${CREATE_SUPPORT_TICKET_ENDPOINT}/${id}`, ticketData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const getAllSupportTickets = createAsyncThunk(
  "support/getAlltickets",
  async (userData) => {
    try {
      const response = await api.get(CREATE_SUPPORT_TICKET_ENDPOINT);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);
export const getSupportTicketsByUserId = createAsyncThunk(
  "support/getsupportticketsByUserId",
  async (id) => {
    try {
      const response = await api.get(`${CREATE_SUPPORT_TICKET_ENDPOINT}/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

export const deleteSupportTicketsById = createAsyncThunk(
  "support/deleteSupportTicketsById",
  async (id) => {
    try {
      const response = await api.delete(`${CREATE_SUPPORT_TICKET_ENDPOINT}/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);


export const getNewsBanner = createAsyncThunk(
  "banner/getNewsBanner",
  async (id) => {
    try {
      const response = await api.get(`/admin/banner`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);



const supportTicketSlice = createSlice({
  name: "support",
  initialState,
  reducers: {
    resetSupportState: (state) => {
      state.status = "idle";
      state.error = null;
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createSupportTicket.pending, (state) => {
        state.status = "loading";
        state.loading=true
      })
      .addCase(createSupportTicket.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload?.data;
        state.loading=false
      })
      .addCase(createSupportTicket.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        state.loading=false
      })


      .addCase(editSupportTicket.pending, (state) => {
        state.status = "loading";
        state.loading=true
      })
      .addCase(editSupportTicket.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.editSupportTicketValue = action.payload;
        state.loading=false
      })
      .addCase(editSupportTicket.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        state.loading=false
      })

      .addCase(getAllSupportTickets.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllSupportTickets.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.allTickets = action.payload?.data;

      })
      .addCase(getAllSupportTickets.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(getSupportTicketsByUserId.pending, (state) => {
        state.status = "loading";
        state.loading=true
      })
      .addCase(getSupportTicketsByUserId.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.getSupportTicketsByUserIdValue = action.payload?.data;
        state.loading=false

      })
      .addCase(getSupportTicketsByUserId.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        state.loading=false

      })


      .addCase(deleteSupportTicketsById.pending, (state) => {
        state.status = "loading";
        state.loading=true
      })
      .addCase(deleteSupportTicketsById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.deleteSupportTicketsByIdValue = action.payload?.data;
        state.loading=false

      })
      .addCase(deleteSupportTicketsById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        state.loading=false

      })



       .addCase(getNewsBanner.pending, (state) => {
        state.status = "loading";
        state.loading=true
      })
      .addCase(getNewsBanner.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.getNewsBannerValue = action.payload?.data;
        state.loading=false

      })
      .addCase(getNewsBanner.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        state.loading=false

      })
  },
});

export default supportTicketSlice.reducer;
