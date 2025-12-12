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


// ----------------------
// 🔹 Slice
// ----------------------
const schoolSlice = createSlice({
  name: "school",
  initialState: {
    users: [],
    schools: [],
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
      });
  },
});

export default schoolSlice.reducer;
