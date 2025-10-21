import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as applicationAPI from '../../services/applicationService';

export const getMyApplications = createAsyncThunk('applications/getMyApplications', async (_, { rejectWithValue }) => {
  try {
    const response = await applicationAPI.getMyApplications();
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message);
  }
});

export const applyForJob = createAsyncThunk('applications/applyForJob', async ({ jobId, data }, { rejectWithValue }) => {
  try {
    const response = await applicationAPI.applyForJob(jobId, data);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message);
  }
});

const applicationSlice = createSlice({
  name: 'applications',
  initialState: {
    applications: [],
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
      .addCase(getMyApplications.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMyApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.applications = action.payload;
      })
      .addCase(getMyApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(applyForJob.fulfilled, (state, action) => {
        state.applications.unshift(action.payload);
      });
  }
});

export const { clearError } = applicationSlice.actions;
export default applicationSlice.reducer;
