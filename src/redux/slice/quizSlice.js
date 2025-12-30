import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../service/api";

/* ================= FETCH QUIZ ================= */
// Fetch quiz by ID (teacher-generated) or generate new (optional AI)
export const fetchQuiz = createAsyncThunk(
  "quiz/fetch",
  async ({ quizId, topic, difficulty }, { rejectWithValue }) => {
    try {
      let res;

      if (quizId) {
        // Fetch an existing teacher-generated quiz
        res = await api(`/api/quiz/student/${quizId}`, "GET");
      } else {
    
   res = await api(`/api/quiz/student/`, "POST",{ topic, difficulty });
      }

      return res; // { success, quizId, questions }
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/* ================= SUBMIT QUIZ ================= */
export const submitQuiz = createAsyncThunk(
  "quiz/submit",
  async ({ quizId, answers }, { rejectWithValue }) => {
    try {
      return await api("/api/quiz/submit", "POST", { quizId, answers });
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/* ================= LIST TEACHER QUIZZES ================= */
export const fetchTeacherQuizzes = createAsyncThunk(
  "quiz/fetchTeacherQuizzes",
  async (_, { rejectWithValue }) => {
    try {
      return await api("/api/quiz/list/teacher", "GET"); // returns array of {_id, topic, difficulty, isActive, totalQuestions}
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
// view all qiz for students
export const fetchStudentQuizzes = createAsyncThunk(
  "quiz/fetchStudentQuizzes",
  async (_, { rejectWithValue }) => {
    try {
      return await api("/api/quiz/list/student", "GET");
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const quizSlice = createSlice({
  name: "quiz",
  initialState: {
    questions: [],
    quizId: null,
    result: null,
    loading: false,
    error: null,
    teacherQuizzes: [],
    studentQuizzes: [],
  },
  reducers: {
    resetQuiz: (state) => {
      state.questions = [];
      state.quizId = null;
      state.result = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* FETCH QUIZ */
      .addCase(fetchQuiz.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchQuiz.fulfilled, (state, action) => {
        state.loading = false;
        state.questions = action.payload.questions;
        state.quizId = action.payload.quizId;
      })
      .addCase(fetchQuiz.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      /* SUBMIT QUIZ */
      .addCase(submitQuiz.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(submitQuiz.fulfilled, (state, action) => { state.loading = false; state.result = action.payload; })
      .addCase(submitQuiz.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      /* FETCH TEACHER QUIZZES */
      .addCase(fetchTeacherQuizzes.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchTeacherQuizzes.fulfilled, (state, action) => { state.loading = false; state.teacherQuizzes = action.payload; })
      .addCase(fetchTeacherQuizzes.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      /* FETCH STUDENT QUIZZES */
      .addCase(fetchStudentQuizzes.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchStudentQuizzes.fulfilled, (state, action) => { state.loading = false; state.studentQuizzes = action.payload; })
      .addCase(fetchStudentQuizzes.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});


export const { resetQuiz } = quizSlice.actions;
export default quizSlice.reducer;
