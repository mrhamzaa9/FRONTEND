import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../service/api";
// ===========================
// Thunks
// ===========================

// 1️⃣ Enroll in a course
export const enrollCourse = createAsyncThunk(
  "student/enrollCourse",
  async ({ courseId }, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/enroll", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      return { courseId, message: data.message };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
// At the top of your slice file
const enrolledCoursesFromStorage = JSON.parse(localStorage.getItem("enrolledCourses")) || [];
const selectedSchoolsFromStorage = JSON.parse(localStorage.getItem("selectedSchools")) || [];

// 2️⃣ Select a school
export const selectSchool = createAsyncThunk(
  "student/selectSchool",
  async ({ schoolId }, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/school/select", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schoolId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      return { schoolId, message: data.message };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
//fetch entroll
export const fetchEnrolledCourses = createAsyncThunk(
  "student/fetchEnrolledCourses",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/entroll/my-course","GET" ,{
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      return data.courses || [];
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
// Fetch assignments by course
export const fetchAssignmentsByCourse = createAsyncThunk(
  "student/fetchAssignments",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api("/api/assign/assignments", "GET");
      return res.assignments;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Submit assignment
export const submitAssignment = createAsyncThunk(
  "student/submitAssignment",
  async ({ assignmentId, fileUrl }, { rejectWithValue }) => {
    try {
      const res = await api("/api/assign/submit", "POST", { assignmentId, fileUrl });
      return res.submission;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ===========================
// Slice
// ===========================
const studentSlice = createSlice({
  name: "student",
  initialState: {
       enrolledCourses: enrolledCoursesFromStorage, // load from localStorage
    selectedSchools: selectedSchoolsFromStorage, // load from localStorage
    loading: "idle",
    error: null,
    assignments: [],
    submissions: {},
    message: null,
  },
  reducers: {
    clearMessage: (state) => {
      state.message = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ---------------------------
      // Enroll Course
      // ---------------------------
      .addCase(enrollCourse.pending, (state) => {
        state.loading = "loading";
      })
      .addCase(enrollCourse.fulfilled, (state, action) => {
        state.loading = "succeeded";
        const { courseId, message } = action.payload;
        if (!state.enrolledCourses.includes(courseId)) {
          state.enrolledCourses.push(courseId);
          // Save to localStorage
          localStorage.setItem("enrolledCourses", JSON.stringify(state.enrolledCourses));
        }
        state.message = message || "Course enrolled successfully";
      })

      .addCase(enrollCourse.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload;
      })

      // ---------------------------
      // Select School
      // ---------------------------
      .addCase(selectSchool.pending, (state) => {
        state.loading = "loading";
      })
      .addCase(selectSchool.fulfilled, (state, action) => {
        state.loading = "succeeded";
        const { schoolId, message } = action.payload;
        if (!state.selectedSchools.includes(schoolId)) {
          state.selectedSchools.push(schoolId);
          localStorage.setItem("selectedSchools", JSON.stringify(state.selectedSchools));
        }
        state.message = message || "School selected successfully";
      })
      .addCase(selectSchool.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload;
      })
      .addCase(fetchAssignmentsByCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssignmentsByCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.assignments = action.payload;
      })
      .addCase(fetchAssignmentsByCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Submit assignment
      .addCase(submitAssignment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitAssignment.fulfilled, (state, action) => {
        state.loading = false;
        const sub = action.payload;
        state.submissions[sub.assignmentId] = sub;
        state.message = "Assignment submitted successfully";
      })
      .addCase(submitAssignment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearMessage } = studentSlice.actions;
export default studentSlice.reducer;
