import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../service/api";

/* ======================
   FETCH SUBMISSIONS
====================== */
export const fetchTeacherSubmissions = createAsyncThunk(
  "teacherSubmissions/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api("/api/assign", "GET");
      return res.submissions;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/* ======================
   GRADE SUBMISSION
====================== */
export const gradeSubmission = createAsyncThunk(
  "teacherSubmissions/grade",
  async ({ submissionId, grade, feedback }, { rejectWithValue }) => {
    try {
      const res = await api("/api/assign/grade", "POST", {
        submissionId,
        grade,
        feedback,
      });
      return res.submission;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
// get student result of assignment
export const fetchResultAssignments = createAsyncThunk(
  "student/result",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api("/api/assign/student/results", "GET");
      return res.submissions;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const SubmissionSlice = createSlice({
  name: "Submissions",
  initialState: {
    submissions: [],
    loading: false,
    error: null,
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
      // fetch
      .addCase(fetchTeacherSubmissions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTeacherSubmissions.fulfilled, (state, action) => {
        state.loading = false;
        state.submissions = action.payload;
      })
      .addCase(fetchTeacherSubmissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // grade
      .addCase(gradeSubmission.fulfilled, (state, action) => {
        state.message = "Submission graded successfully";

        const index = state.submissions.findIndex(
          (s) => s._id === action.payload._id
        );
        if (index !== -1) {
          state.submissions[index] = action.payload;
        }
      })
      //results
      .addCase(fetchResultAssignments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResultAssignments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchResultAssignments.fulfilled, (state, action) => {
        state.loading = false;
       state.submissions = action.payload;
      })
  },
});

export const { clearMessage } = SubmissionSlice.actions;
export default SubmissionSlice.reducer;
