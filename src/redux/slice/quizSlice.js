import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../service/api";


// get student result of assignment
export const fetchQuiz = createAsyncThunk(
  "student/quiz",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api("/api/quiz/student", "GET");
      return res.questions;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
export const submitQuiz = createAsyncThunk(
  "student/quiz/submit",
  async (payload, { rejectWithValue }) => {
    try {
      return await api("/api/quiz/submit", "POST", payload);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
const quizSlice = createSlice({
  name: "quiz",
  initialState: { questions: [],
     loading: "idle",
    error:null,
     },
  extraReducers: builder => {
    builder
      .addCase(fetchQuiz.pending, state => { state.loading = true })
      .addCase(fetchQuiz.fulfilled, (state, action) => {
        state.loading = false;
        state.questions = action.payload;
      })
            .addCase(submitQuiz.fulfilled, (state, action) => {
        state.result = action.payload.result;
      });

  }
});

export default quizSlice.reducer;
