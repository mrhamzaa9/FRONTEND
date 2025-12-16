
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../service/api";

// Fetch pending teacher requests
export const fetchTeacherRequests = createAsyncThunk(
  "school/fetchTeacherRequests",
  async (_, { rejectWithValue }) => {
    try {
      return await api("/api/school/teacher/request", "GET");
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Approve/reject teacher
export const processTeacherRequest = createAsyncThunk(
  "school/processTeacherRequest",
  async ({ teacherId, approve, schoolId, courseIds = [] }, { rejectWithValue }) => {
    try {
      return await api("/api/school/teacher/approve", "POST", {
        teacherId,
        approve,
        schoolId,
        courseIds,
      });
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const teacherSlice = createSlice({
  name: "teacher",
  initialState: {
    requests: [],
    loading: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeacherRequests.pending, (state) => { state.loading = "loading"; })
      .addCase(fetchTeacherRequests.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.requests = action.payload;
      })
      .addCase(fetchTeacherRequests.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload;
      })
      .addCase(processTeacherRequest.pending, (state) => { state.loading = "loading"; })
      .addCase(processTeacherRequest.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.requests = state.requests.filter(req => req._id !== action.meta.arg.teacherId);
      })
      .addCase(processTeacherRequest.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload;
      });
  },
});

export default teacherSlice.reducer;
