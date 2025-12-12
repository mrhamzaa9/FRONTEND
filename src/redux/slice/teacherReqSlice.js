// src/redux/slice/teacherSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../service/api"; // or use fetch wrapper

// Fetch all schools
export const fetchSchools = createAsyncThunk(
  "teacher/fetchSchools",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("http://localhost:4000/api/school/", {
        credentials: "include",
      });
      const data = await res.json();
      return data.schools || data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Request to join a school
// Request to join a school
export const requestToJoinSchool = createAsyncThunk(
  "teacher/requestToJoinSchool",
  async ({ schoolId, courseIds }, { rejectWithValue }) => {
    try {
      const res = await fetch("http://localhost:4000/api/school/teacher/request", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schoolId, courseIds }), // send courseIds here
      });
      const data = await res.json();
      return { schoolId, message: data.message };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
export const cancelRequest = createAsyncThunk(
  "teacherReq/cancelRequest",
  async (schoolId, { rejectWithValue }) => {
    try {
      const res = await fetch("http://localhost:4000/api/school/teacher/cancel", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schoolId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error canceling request");
      return schoolId; // return the schoolId to remove from state
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const teacherReqSlice = createSlice({
  name: "teacherReq",
  initialState: {
    schools: [],
    requested: [], // store requested school IDs
    loading: "idle",
    error: null,
    message: null,
  },
  reducers: {
    clearMessage: (state) => { state.message = null; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSchools.pending, (state) => { state.loading = "loading"; })
      .addCase(fetchSchools.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.schools = action.payload;
      })
      .addCase(fetchSchools.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload;
      })
      .addCase(requestToJoinSchool.pending, (state) => { state.loading = "loading"; })
      .addCase(requestToJoinSchool.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.requested.push(action.payload.schoolId);
        state.message = action.payload.message;
      })
      .addCase(requestToJoinSchool.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload;
      })
      .addCase(cancelRequest.pending, (state) => { state.loading = "loading"; })
      .addCase(cancelRequest.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.requested = state.requested.filter(id => id !== action.payload);
        state.message = "Request canceled successfully";
      })
      .addCase(cancelRequest.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearMessage } = teacherReqSlice.actions;
export default teacherReqSlice.reducer;
