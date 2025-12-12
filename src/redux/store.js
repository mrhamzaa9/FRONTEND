import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";
import schoolReducer from "./slice/schoolSlice";
import courseReducer from "./slice/courseSlice";
import teacherReducer from "./slice/teacherSlice";
import teacherReqReducer from "./slice/teacherReqSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    school: schoolReducer,
    course: courseReducer,
    teacher: teacherReducer,
    teacherReq: teacherReqReducer,
  },
});
