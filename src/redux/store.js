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
import SubmissionReducer from "./slice/SubmissionSlice"
import quizSlice from './slice/quizSlice'
import verifyReducer from'./slice/verifySlice'
import dashboardSlice from"./slice/dashboardSlice"
import passwordReducer from "./slice/passwordSlice"
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
    Submissions: SubmissionReducer,
    quiz:quizSlice,
    verify : verifyReducer,
    password:passwordReducer,
    dashboard:dashboardSlice,
  },
});
