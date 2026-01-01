import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {api} from "../../service/api";

/* ===============================
   Async Thunks
================================ */

// Super Admin Dashboard
export const fetchSuperAdminDashboard = createAsyncThunk(
  "dashboard/fetchSuperAdmin",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/dashboard/superadmin");
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || err.message
      );
    }
  }
);

// School Admin Dashboard
export const fetchSchoolAdminDashboard = createAsyncThunk(
  "dashboard/fetchSchoolAdmin",
  async (schoolId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/dashboard/schooladmin/${schoolId}`);
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || err.message
      );
    }
  }
);

// Teacher Dashboard
export const fetchTeacherDashboard = createAsyncThunk(
  "dashboard/fetchTeacher",
  async (teacherId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/dashboard/teacher/${teacherId}`);
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || err.message
      );
    }
  }
);

// Student Dashboard
export const fetchStudentDashboard = createAsyncThunk(
  "dashboard/fetchStudent",
  async (studentId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/dashboard/student/${studentId}`);
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || err.message
      );
    }
  }
);

/* ===============================
   Slice
================================ */

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    loading: false,
    error: null,

    superAdmin: null,
    schoolAdmin: null,
    teacher: null,
    student: null,
  },

  reducers: {
    clearDashboard: (state) => {
      state.superAdmin = null;
      state.schoolAdmin = null;
      state.teacher = null;
      state.student = null;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // Super Admin
      .addCase(fetchSuperAdminDashboard.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSuperAdminDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.superAdmin = action.payload;
      })
      .addCase(fetchSuperAdminDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // School Admin
      .addCase(fetchSchoolAdminDashboard.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSchoolAdminDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.schoolAdmin = action.payload;
      })
      .addCase(fetchSchoolAdminDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Teacher
      .addCase(fetchTeacherDashboard.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTeacherDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.teacher = action.payload;
      })
      .addCase(fetchTeacherDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Student
      .addCase(fetchStudentDashboard.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStudentDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.student = action.payload;
      })
      .addCase(fetchStudentDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearDashboard } = dashboardSlice.actions;
export default dashboardSlice.reducer;
