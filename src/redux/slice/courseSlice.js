import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../service/api";
// CREATE COURSE
export const createCourse = createAsyncThunk(
  "school/createCourse",
  async (data, { rejectWithValue }) => {
    try {
      return await api("/api/course/create", "POST", data);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
const courseSlice = createSlice({
    name: "course",
    initialState: {
        courses: [],
        loading: "idle",
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createCourse.pending, (state) => {
                state.loading = "loading";
                state.error = null;
            })
            .addCase(createCourse.fulfilled, (state, action) => {
                state.loading = "succeeded";
                state.courses.push(action.payload);
            })
            .addCase(createCourse.rejected, (state, action) => {
                state.loading = "failed";
                state.error = action.payload;
            });
    },
});

export default courseSlice.reducer;