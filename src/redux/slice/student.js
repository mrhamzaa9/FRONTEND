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
      const data = await api("/api/enroll", "POST", { courseId });
      return { courseId, message: data.message };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// 2️⃣ Select a school
export const selectSchool = createAsyncThunk(
  "student/selectSchool",
  async ({ schoolId }, { rejectWithValue }) => {
    try {
      const data = await api("/api/school/select", "POST", { schoolId });
      return { schoolId, message: data.message };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// 3️⃣ Fetch enrolled courses
export const fetchEnrolledCourses = createAsyncThunk(
  "student/fetchEnrolledCourses",
  async (_, { rejectWithValue }) => {
    try {
      const data = await api("/api/entroll/my-course", "GET");
      return data.courses || [];
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// 4️⃣ Fetch assignments
export const fetchAssignmentsByCourse = createAsyncThunk(
  "student/fetchAssignments",
  async (_, { rejectWithValue }) => {
    try {
      const data = await api("/api/assign/assignments", "GET");
      return data.assignments || [];
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// 5️⃣ Submit assignment (supports FormData)
export const submitAssignment = createAsyncThunk(
  "student/submitAssignment",
  async (formData, { rejectWithValue }) => {
    try {
      const data = await api("/api/assign/submit", "POST", formData, true); // `true` for FormData
      return data; // { submission, message }
    } catch (err) {
      return rejectWithValue(err.message || "Submission failed");
    }
  }
);
export const fetchStudentState = createAsyncThunk(
  "student/fetchStudentState",
  async (_, { rejectWithValue }) => {
    try {
      const data = await api("/api/enroll/me", "GET");
      return data;
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
    enrolledCourses: [],
    selectedSchools: [],
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
      // Enroll Course
      .addCase(enrollCourse.pending, (state) => {
        state.loading = "loading";
      })
      .addCase(enrollCourse.fulfilled, (state, action) => {
        state.loading = "succeeded";
        const {  message } = action.payload;
      
        state.message = message || "Course enrolled successfully";
      })
      .addCase(enrollCourse.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload;
      })

      // Select School
      .addCase(selectSchool.pending, (state) => {
        state.loading = "loading";
      })
      .addCase(selectSchool.fulfilled, (state, action) => {
        state.loading = "succeeded";
        const { message } = action.payload;
      
        state.message = message || "School selected successfully";
      })
      .addCase(selectSchool.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload;
      })

      // Fetch assignments
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
        const { submission, message } = action.payload;
        state.submissions[submission.assignmentId] = submission;
        state.message = message || "Assignment submitted successfully";
      })
      .addCase(submitAssignment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  .addCase(fetchStudentState.fulfilled, (state, action) => {
      state.selectedSchools = action.payload.selectedSchools || [];
      state.enrolledCourses = action.payload.enrolledCourses || [];
    })
  },
});

export const { clearMessage } = studentSlice.actions;
export default studentSlice.reducer;
