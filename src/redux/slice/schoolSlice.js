import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../service/api";

// ----------------------
// 🔹 Async Thunks
// ----------------------

// GET ALL USERS
export const fetchUsers = createAsyncThunk(
  "admin/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      return await api("/api/superadmin/totalusers", "GET");
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
//Fetch schools with courses
// =====================
export const fetchSchoolsWithCourses = createAsyncThunk(
  "schools/fetchWithCourses",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api("/api/school/teacher-approve", "GET");
      return res; // array of schools with courses
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch schools");
    }
  }
);
// GET ALL SCHOOLS
export const fetchSchools = createAsyncThunk(
  "admin/fetchSchools",
  async (_, { rejectWithValue }) => {
    try {
      return await api("/api/superadmin/", "GET");
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// CREATE SCHOOL
export const createSchool = createAsyncThunk(
  "admin/createSchool",
  async (schoolData, { rejectWithValue }) => {
    try {
      const response = await api("/api/school/create", "POST", schoolData);
      return response; // new school object
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// DELETE USER
export const deleteUser = createAsyncThunk(
  "admin/deleteUser",
  async (userId, { rejectWithValue }) => {
    try {
      await api(`/api/superadmin/user/delete/${userId}`, "DELETE");
      return userId;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// DELETE SCHOOL
export const deleteSchool = createAsyncThunk(
  "admin/deleteSchool",
  async (id, { rejectWithValue }) => {
    try {
      await api(`/api/superadmin/delete/${id}`, "DELETE");
      return id;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
// fetch own school
export const fetchMySchool = createAsyncThunk(
  "school/fetchMySchool",
  async (_, { rejectWithValue }) => {
    try {
      // this API uses createdBy = req.user.id (we fixed backend already)
      return await api("/api/school/my-school", "GET");
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch my school");
    }
  }
);
// delete course by admin
// 🔴 DELETE COURSE
export const deleteCourse = createAsyncThunk(
  "school/deleteCourse",
  async (id, { rejectWithValue }) => {
    try {
      await api(`/api/course/${id}`, "DELETE");
      return id;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);


// ----------------------
// 🔹 Slice
// ----------------------
const schoolSlice = createSlice({
  name: "school",
  initialState: {
    users: [],
    schools: [],       // SuperAdmin – all schools
    mySchool: [],      // SchoolAdmin – only own school
    approved: [],
    loading: "idle",
    error: null,
  },

  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH USERS
      .addCase(fetchUsers.pending, (state) => {
        state.loading = "loading";
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload;
      })

      // FETCH SCHOOLS
      .addCase(fetchSchools.pending, (state) => {
        state.loading = "loading";
        state.error = null;
      })
      .addCase(fetchSchools.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.schools = action.payload;
      })
      .addCase(fetchSchools.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload;
      })

      // CREATE SCHOOL
      .addCase(createSchool.pending, (state) => {
        state.loading = "loading";
        state.error = null;
      })
      .addCase(createSchool.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.schools.push(action.payload); // add new school to state
      })
      .addCase(createSchool.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload;
      })
      //fetch school with course
      .addCase(fetchSchoolsWithCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
    .addCase(fetchSchoolsWithCourses.fulfilled, (state, action) => {
  state.loading = false;

  // backend already returns clean structure
  state.approved = action.payload.schools || [];
})


      .addCase(fetchSchoolsWithCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // FETCH MY SCHOOL
      // =====================
      .addCase(fetchMySchool.pending, (state) => {
        state.loading = "loading";
        state.error = null;
      })
      .addCase(fetchMySchool.fulfilled, (state, action) => {
        state.loading = "succeeded";
        // API returns array [school]
        state.mySchool = Array.isArray(action.payload)
          ? action.payload
          : [];
      })
      .addCase(fetchMySchool.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload;
      })


      // DELETE USER
      .addCase(deleteUser.pending, (state) => {
        state.loading = "loading";
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.users = state.users.filter((user) => user._id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload;
      })

      // DELETE SCHOOL
      .addCase(deleteSchool.pending, (state) => {
        state.loading = "loading";
        state.error = null;
      })
      .addCase(deleteSchool.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.schools = state.schools.filter((school) => school._id !== action.payload);
      })
      .addCase(deleteSchool.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload;
      })
      .addCase(deleteCourse.fulfilled, (state, action) => {
  // remove deleted course from mySchool
  state.mySchool = state.mySchool.map((school) => ({
    ...school,
    courses: school.courses.filter(
      (course) => course._id !== action.payload
    ),
  }));
});

  },
});

export default schoolSlice.reducer;
