import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as jobAPI from '../../services/jobService';

export const getJobs = createAsyncThunk('jobs/getJobs', async (filters, { rejectWithValue }) => {
  try {
    const response = await jobAPI.getJobs(filters);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message);
  }
});

export const getJob = createAsyncThunk('jobs/getJob', async (id, { rejectWithValue }) => {
  try {
    const response = await jobAPI.getJob(id);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message);
  }
});

export const getEligibleJobs = createAsyncThunk('jobs/getEligibleJobs', async (_, { rejectWithValue }) => {
  try {
    const response = await jobAPI.getEligibleJobs();
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message);
  }
});

const jobSlice = createSlice({
  name: 'jobs',
  initialState: {
    jobs: [],
    currentJob: null,
    eligibleJobs: [],
    loading: false,
    error: null,
    totalPages: 1,
    currentPage: 1
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getJobs.pending, (state) => {
        state.loading = true;
      })
      .addCase(getJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload.data;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(getJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getJob.fulfilled, (state, action) => {
        state.currentJob = action.payload;
      })
      .addCase(getEligibleJobs.fulfilled, (state, action) => {
        state.eligibleJobs = action.payload;
      });
  }
});

export const { clearError } = jobSlice.actions;
export default jobSlice.reducer;
