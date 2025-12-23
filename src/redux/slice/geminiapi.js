import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../service/api";
// genimi api 
export const fetchTeacherRequests = createAsyncThunk(
  "school/fetchTeacherRequests",
  async (_, { rejectWithValue }) => {
    try {
      return await api("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"
        , "POST");
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
