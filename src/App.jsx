import React, { useEffect } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";


// Auth Context
import { useAuth } from "./context/auth";
import AuthLayout from "./layouts/AuthLayout";
import SuperadminLayout from "./layouts/SuperadminLayout";
import SchooladminLayout from "./layouts/SchooladminLayout";
import TeacherLayout from "./layouts/TeacherLayout";
import StudentLayout from "./layouts/StudentLayout";
import Schooladmin from "./pages/SchoolAdmin/Schooladmin";


import { useSelector } from "react-redux";

export default function App() {
  const { user, loading } = useSelector((state) => state.auth);
  const role = user?.role || localStorage.getItem("role");

  if (loading === "loading") return <p>Loading...</p>;

  return (
    <>
      {!user ? (
        <AuthLayout/>
      ) : (
        <>
          {role === "superadmin" && (
            <Routes>
              <Route path="/*" element={<SuperadminLayout />} />
            </Routes>
          )}

          {role === "schooladmin" && (
            <Routes>
              <Route path="/*" element={<SchooladminLayout />} />
            </Routes>
          )}

          {role === "teacher" && (
            <Routes>
              <Route path="/*" element={<TeacherLayout />} />
            </Routes>
          )}

          {role === "student" && (
            <Routes>
              <Route path="/*" element={<StudentLayout />} />
            </Routes>
          )}
        </>
      )}
    </>
  );
}
