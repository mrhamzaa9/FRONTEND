import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {api} from "../../service/api";

// ✅ Fetch notifications from DB
export const fetchNotifications = createAsyncThunk(
  "notifications",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api("/api/school/notify", "GET");
      return res;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
//mark read
export const markAsReadAsync = createAsyncThunk(
  "notifications/markAsReadAsync",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api(`/api/school/notifications/read/${id}`, "PUT");
      return res; // updated notification
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);


const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    list: [],
    unreadCount: 0 ,
    loading: false,
    error: null,
  },
  reducers: {
    // ✅ Used by socket
    addNotification: (state, action) => {
      state.list.unshift(action.payload);
      if (!action.payload.read) state.unreadCount += 1;
    },

    markAsRead: (state, action) => {
      const notif = state.list.find(n => n._id === action.payload);
      if (notif && !notif.read) {
        notif.read = true;
        state.unreadCount -= 1;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.list = action.payload;
        state.unreadCount = action.payload.filter(n => !n.read).length;
        state.loading = false;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
       .addCase(markAsReadAsync.fulfilled, (state, action) => {
        const notif = state.list.find(n => n._id === action.payload._id);
        if (notif && !notif.read) {
          notif.read = true;
          state.unreadCount -= 1;
        }
      });
      
  },
});

export const { addNotification, markAsRead } = notificationSlice.actions;
export default notificationSlice.reducer;
