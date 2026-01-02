import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../service/api";

/* =========================
   THUNKS
========================= */

// 1️⃣ Fetch all schools
export const fetchSchools = createAsyncThunk(
  "teacherReq/fetchSchools",
  async (_, { rejectWithValue }) => {
    try {
      return await api("/api/school", "GET");
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// 2️⃣ Fetch approved schools (teacher side)
// export const fetchApprovedSchools = createAsyncThunk(
//   "teacherReq/fetchApprovedSchools",
//   async (_, { rejectWithValue }) => {
//     try {
//       return await api("api/school/approved", "GET");
//     } catch (err) {
//       return rejectWithValue(err.message);
//     }
//   }
// );

// 3️⃣ Request course
export const requestCourse = createAsyncThunk(
  "teacherReq/requestCourse",
  async ({ schoolId, courseId }, { rejectWithValue }) => {
    try {
      return await api("/api/school/teacher/request", "POST", {
        schoolId,
        courseIds: [courseId],
      });
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// 4️⃣ Cancel request
export const cancelCourse = createAsyncThunk(
  "teacherReq/cancelCourse",
  async ({ schoolId }, { rejectWithValue }) => {
    try {
      return await api("/api/school/teacher/cancel", "POST", { schoolId });
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/* =========================
   SLICE
========================= */

const teacherReqSlice = createSlice({
  name: "teacherReq",
  initialState: {
    schools: [],
    teacherCourses: {}, // ⭐ normalized state
    loading: false,
    error: null,
  },

  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },

 extraReducers: (builder) => {
  builder
    /* ===== FETCH SCHOOLS ===== */
    .addCase(fetchSchools.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchSchools.fulfilled, (state, action) => {
      state.loading = false;
      state.schools = action.payload;
    })
    .addCase(fetchSchools.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

    /* ===== FETCH APPROVED ===== */
    // .addCase(fetchApprovedSchools.fulfilled, (state, action) => {
    //   const map = {};
    //   action.payload.schools.forEach((school) => {
    //     if (!map[school.schoolId]) map[school.schoolId] = {};
    //     school.courseIds.forEach((course) => {
    //       map[school.schoolId][course._id] = "approved";
    //     });
    //   });
    //   state.teacherCourses = map;
    // })
    // .addCase(fetchApprovedSchools.rejected, (state, action) => {
    //   state.error = action.payload;
    // })

    /* ===== REQUEST COURSE ===== */
    .addCase(requestCourse.fulfilled, (state, action) => {
      const { schoolId, courseId } = action.meta.arg;
      if (!state.teacherCourses[schoolId]) state.teacherCourses[schoolId] = {};
      state.teacherCourses[schoolId][courseId] = "pending";
    })
    .addCase(requestCourse.rejected, (state, action) => {
      state.error = action.payload;
    })

    /* ===== CANCEL COURSE ===== */
    .addCase(cancelCourse.fulfilled, (state, action) => {
      const { schoolId } = action.meta.arg;
      if (state.teacherCourses[schoolId]) {
        Object.keys(state.teacherCourses[schoolId]).forEach((courseId) => {
          if (state.teacherCourses[schoolId][courseId] === "pending") {
            delete state.teacherCourses[schoolId][courseId];
          }
        });
      }
    })
    .addCase(cancelCourse.rejected, (state, action) => {
      state.error = action.payload;
    });
}
});
export const { clearError } = teacherReqSlice.actions;
export default teacherReqSlice.reducer;
