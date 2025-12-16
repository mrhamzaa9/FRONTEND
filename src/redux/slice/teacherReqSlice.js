import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

/* =======================
   LocalStorage Helpers
======================= */

const loadRequested = () => {
  try {
    const data = localStorage.getItem("teacher_requested");
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
};

const saveRequested = (requested) => {
  localStorage.setItem(
    "teacher_requested",
    JSON.stringify(requested)
  );
};

/* =======================
   Fetch Schools
======================= */

export const fetchSchools = createAsyncThunk(
  "teacherReq/fetchSchools",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("http://localhost:4000/api/school/", {
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      return data.schools || data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/* =======================
   Request Course(s)
======================= */

export const requestToJoinSchool = createAsyncThunk(
  "teacherReq/requestToJoinSchool",
  async ({ schoolId, courseIds }, { rejectWithValue }) => {
    try {
      const res = await fetch(
        "http://localhost:4000/api/school/teacher/request",
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ schoolId, courseIds }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      return { schoolId, courseIds, message: data.message };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/* =======================
   Cancel SINGLE Course
======================= */

export const cancelRequest = createAsyncThunk(
  "teacherReq/cancelRequest",
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

/* =======================
   Slice
======================= */

const teacherReqSlice = createSlice({
  name: "teacherReq",
  initialState: {
    schools: [],
    requested: loadRequested(), // ✅ LOCAL LOAD
    loading: "idle",
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

      /* ---- Fetch Schools ---- */
      .addCase(fetchSchools.pending, (state) => {
        state.loading = "loading";
      })
      .addCase(fetchSchools.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.schools = action.payload;
      })
      .addCase(fetchSchools.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload;
      })

      /* ---- Request Course(s) ---- */
      .addCase(requestToJoinSchool.pending, (state) => {
        state.loading = "loading";
      })
      .addCase(requestToJoinSchool.fulfilled, (state, action) => {
        state.loading = "succeeded";

        const { schoolId, courseIds, message } = action.payload;

        if (!state.requested[schoolId]) {
          state.requested[schoolId] = [];
        }

        courseIds.forEach((courseId) => {
          if (!state.requested[schoolId].includes(courseId)) {
            state.requested[schoolId].push(courseId);
          }
        });

        saveRequested(state.requested); // ✅ LOCAL SAVE
        state.message = message;
      })
      .addCase(requestToJoinSchool.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload;
      })

      /* ---- Cancel Single Course ---- */
      .addCase(cancelRequest.pending, (state) => {
        state.loading = "loading";
      })
      .addCase(cancelRequest.fulfilled, (state, action) => {
        state.loading = "succeeded";

        const { schoolId, courseId } = action.payload;

        state.requested[schoolId] =
          state.requested[schoolId]?.filter(
            (id) => id !== courseId
          ) || [];

        if (state.requested[schoolId].length === 0) {
          delete state.requested[schoolId];
        }

        saveRequested(state.requested); // ✅ LOCAL SAVE
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
