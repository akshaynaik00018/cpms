import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as notificationAPI from '../../services/notificationService';

export const getNotifications = createAsyncThunk('notifications/getNotifications', async (filters, { rejectWithValue }) => {
  try {
    const response = await notificationAPI.getNotifications(filters);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message);
  }
});

export const markAsRead = createAsyncThunk('notifications/markAsRead', async (id, { rejectWithValue }) => {
  try {
    await notificationAPI.markAsRead(id);
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message);
  }
});

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    notifications: [],
    unreadCount: 0,
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getNotifications.fulfilled, (state, action) => {
        state.notifications = action.payload.data;
        state.unreadCount = action.payload.unreadCount;
      })
      .addCase(markAsRead.fulfilled, (state, action) => {
        const index = state.notifications.findIndex(n => n._id === action.payload);
        if (index !== -1) {
          state.notifications[index].isRead = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      });
  }
});

export default notificationSlice.reducer;
