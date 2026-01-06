import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import Spinner from "../../components/Spinner";

import {
  fetchSchools,
  fetchApprovedTeacherCourses,
  requestCourse,
  cancelCourse,
  clearError,
} from "../../redux/slice/teacherReqSlice";

import Teacherchart from "../../components/Teacherchart";

export default function TeacherDashboard() {
  const dispatch = useDispatch();

  const { schools, teacherCourses, loading, error } = useSelector(
    (state) => state.teacherReq
  );

  /* ======================
     LOAD DATA
  ====================== */
  useEffect(() => {
    dispatch(fetchSchools());
    dispatch(fetchApprovedTeacherCourses());
  }, [dispatch]);

  /* ======================
     ERROR HANDLING
  ====================== */
  useEffect(() => {
    if (error) {
      Swal.fire("Error", error, "error");
      dispatch(clearError());
    }
  }, [error, dispatch]);

  if (loading) return <Spinner />;

  return (
    <div className="p-6 flex flex-col bg-amber-50 min-h-screen">
      
      <h2 className="text-2xl text-amber-600 font-bold mb-5">Teacher Dashboard</h2>

      {schools.length === 0 && <p>No schools found.</p>}

      {schools.map((school) => (
        <div key={school._id} className="border p-4 rounded mb-4 shadow-sm">
          <h3 className="text-lg font-semibold mb-3">{school.name}</h3>

          {/* COURSES */}
          {school.courses?.map((course) => {
  const status = teacherCourses?.[school._id]?.[course._id];

  // ✅ FIX: check assignment from school.teachers
  const alreadyAssigned = school.teachers?.some((t) =>
    t.courseIds?.some(
      (cId) => cId.toString() === course._id.toString()
    )
  );

  return (
    <div
      key={course._id}
      className="flex items-center justify-between border m-2 px-4 py-2 rounded shadow"
    >
      <span className="font-medium">{course.name}</span>

      {/* 🔒 Already assigned */}
      {alreadyAssigned && !status && (
        <span className="text-red-500 text-sm font-semibold">
          Already teacher aviable
        </span>
      )}

      {/* ✅ Request allowed */}
      {!alreadyAssigned && !status && (
        <button
          onClick={() =>
            dispatch(
              requestCourse({
                schoolId: school._id,
                courseId: course._id,
              })
            )
          }
          className="px-3 py-1 bg-amber-500 text-white rounded text-sm hover:bg-amber-600"
        >
          Request
        </button>
      )}

      {/* ⏳ Pending */}
      {status === "pending" && (
        <button
          onClick={() =>
            dispatch(
              cancelCourse({
                schoolId: school._id,
              })
            )
          }
          className="px-3 py-1 bg-yellow-500 text-white rounded text-sm"
        >
          Pending
        </button>
      )}

      {/* ✅ Approved */}
      {status === "approved" && (
        <span className="text-green-600 font-semibold">Approved</span>
      )}
    </div>
  );
})}
        </div>
      ))} 

      <div className="mt-10">
        <Teacherchart />
      </div>
    </div>
  );
}
