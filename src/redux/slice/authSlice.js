import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../service/api";

// LOGIN
export const loginUser = createAsyncThunk(
  "auth/login",
  async (formData, { rejectWithValue }) => {
    try {
      return await api("/api/auth/login", "POST", formData);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// REGISTER
export const registerUser = createAsyncThunk(
  "auth/register",
  async (formData, { rejectWithValue }) => {
    try {
      return await api("/api/auth/register", "POST", formData);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Initialize state from localStorage if available
const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  loading: "idle",
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.loading = "idle";
      state.error = null;
      localStorage.removeItem("user"); // remove from localStorage on logout
    },
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.user = action.payload;
        localStorage.setItem("user", JSON.stringify(action.payload)); // save to localStorage
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload;
      })

      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.loading = "loading";
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.user = action.payload;
        localStorage.setItem("user", JSON.stringify(action.payload)); // save to localStorage
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
