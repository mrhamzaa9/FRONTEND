import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../service/api";

/* ===========================
   THUNKS
=========================== */

// 1️⃣ Create assignment
export const createAssignment = createAsyncThunk(
  "assignments/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api("/api/assign/create", "POST", data);
      return res.assignment; // backend should return the created assignment
    } catch (err) {
      return rejectWithValue(err.message || "Failed to create assignment");
    }
  }
);

// 2️⃣ Fetch assignments by course
export const fetchAssignmentsByCourse = createAsyncThunk(
  "assignments/fetchByCourse",
  async (courseId, { rejectWithValue }) => {
    try {
      const res = await api(`/api/assignments?courseId=${courseId}`, "GET");
      return res.assignments; // backend returns array of assignments
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch assignments");
    }
  }
);

// 3️⃣ Optionally: delete assignment
export const deleteAssignment = createAsyncThunk(
  "assignments/delete",
  async (assignmentId, { rejectWithValue }) => {
    try {
      await api(`/api/assignments/${assignmentId}`, "DELETE");
      return assignmentId;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to delete assignment");
    }
  }
);

/* ===========================
   SLICE
=========================== */

const assignmentSlice = createSlice({
  name: "assignments",
  initialState: {
    list: [],       // array of assignments
    loading: false,
    error: null,
  },
  reducers: {
    clearAssignments: (state) => {
      state.list = [];
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create
      .addCase(createAssignment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAssignment.fulfilled, (state, action) => {
        state.loading = false;
        state.list.unshift(action.payload);
      })
      .addCase(createAssignment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch by course
      .addCase(fetchAssignmentsByCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssignmentsByCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchAssignmentsByCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteAssignment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAssignment.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter(a => a._id !== action.payload);
      })
      .addCase(deleteAssignment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAssignments } = assignmentSlice.actions;
export default assignmentSlice.reducer;
