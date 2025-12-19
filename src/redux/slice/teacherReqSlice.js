import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

/* ======================
   FETCH SCHOOLS
====================== */
export const fetchSchools = createAsyncThunk(
  "teacherReq/fetchSchools",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("http://localhost:4000/api/school/", {
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/* ======================
   FETCH APPROVED COURSES
====================== */
export const fetchApprovedSchools = createAsyncThunk(
  "teacherReq/fetchApproved",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(
        "http://localhost:4000/api/school/teacher-approve",
        { credentials: "include" }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      return data.schools;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/* ======================
   REQUEST COURSE
====================== */
export const requestCourse = createAsyncThunk(
  "teacherReq/requestCourse",
  async ({ schoolId, courseId }, { rejectWithValue }) => {
    try {
      const res = await fetch(
        "http://localhost:4000/api/school/teacher/request",
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ schoolId, courseIds: [courseId] }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      return { schoolId, courseId };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/* ======================
   CANCEL COURSE
====================== */
export const cancelCourse = createAsyncThunk(
  "teacherReq/cancelCourse",
  async ({ schoolId, courseId }, { rejectWithValue }) => {
    try {
      const res = await fetch(
        "http://localhost:4000/api/school/teacher/cancel",
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ schoolId, courseId }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      return { schoolId, courseId };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/* ======================
   SLICE
====================== */
const teacherReqSlice = createSlice({
  name: "teacherReq",
  initialState: {
    schools: [],
    teacherCourses: {}, // ✅ SINGLE SOURCE OF TRUTH
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(fetchSchools.fulfilled, (state, action) => {
        state.schools = action.payload;
      })

      .addCase(requestCourse.fulfilled, (state, action) => {
        const { schoolId, courseId } = action.payload;
        state.teacherCourses[schoolId] ??= {};
        state.teacherCourses[schoolId][courseId] = "pending";
      })

      .addCase(cancelCourse.fulfilled, (state, action) => {
        const { schoolId, courseId } = action.payload;
        delete state.teacherCourses[schoolId]?.[courseId];
      })

      .addCase(fetchApprovedSchools.fulfilled, (state, action) => {
        action.payload.forEach((school) => {
          state.teacherCourses[school.schoolId] ??= {};
          school.courseIds.forEach((course) => {
            state.teacherCourses[school.schoolId][course._id] = "approved";
          });
        });
      });
  },
});

export default teacherReqSlice.reducer;
