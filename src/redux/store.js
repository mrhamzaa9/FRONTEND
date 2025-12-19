import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";
import schoolReducer from "./slice/schoolSlice";
import courseReducer from "./slice/courseSlice";
import teacherReducer from "./slice/teacherSlice";
import teacherReqReducer from "./slice/teacherReqSlice";
import notificationReducer from "./slice/notification.Slice"
import assignmentReducer from "./slice/assignmentSlice"
import studentReducer from "./slice/student";
import studentAssignmentReducer from "./slice/assignmentSlice"
export const store = configureStore({
  reducer: {
    auth: authReducer,
    school: schoolReducer,
    course: courseReducer,
    teacher: teacherReducer,
    notifications: notificationReducer,
    teacherReq: teacherReqReducer,
    assignment: assignmentReducer,
      student: studentReducer,
        assignmentstd: studentAssignmentReducer,
  },
});
