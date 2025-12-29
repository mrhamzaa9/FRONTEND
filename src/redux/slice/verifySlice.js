import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../service/api";

// EMAIL VERIFY
export const verifyEmail = createAsyncThunk(
  "verify/email",
  async (token, { rejectWithValue }) => {
    try {
      return await api(`/api/auth/verify/${token}`, "GET");
    } catch (err) {
      return rejectWithValue(err.message || "Verification failed");
    }
  }
);

const verifySlice = createSlice({
  name: "verify",
  initialState: {
    loading: false,
    success: false,
    error: null,
  },
  reducers: {
    resetVerifyState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(verifyEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyEmail.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetVerifyState } = verifySlice.actions;
export default verifySlice.reducer;
