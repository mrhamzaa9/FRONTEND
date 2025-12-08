import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";
import schoolReducer from "./slice/schoolSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    school: schoolReducer,
  },
});
