import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as studentAPI from '../../services/studentService';

export const getProfile = createAsyncThunk('student/getProfile', async (_, { rejectWithValue }) => {
  try {
    const response = await studentAPI.getProfile();
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message);
  }
});

export const updateProfile = createAsyncThunk('student/updateProfile', async (data, { rejectWithValue }) => {
  try {
    const response = await studentAPI.updateProfile(data);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message);
  }
});

export const uploadResume = createAsyncThunk('student/uploadResume', async (file, { rejectWithValue }) => {
  try {
    const response = await studentAPI.uploadResume(file);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message);
  }
});

export const getDashboard = createAsyncThunk('student/getDashboard', async (_, { rejectWithValue }) => {
  try {
    const response = await studentAPI.getDashboard();
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message);
  }
});

const studentSlice = createSlice({
  name: 'student',
  initialState: {
    profile: null,
    dashboard: null,
    loading: false,
    error: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
      })
      .addCase(getDashboard.fulfilled, (state, action) => {
        state.dashboard = action.payload;
      });
  }
});

export const { clearError } = studentSlice.actions;
export default studentSlice.reducer;
