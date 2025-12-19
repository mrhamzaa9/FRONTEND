import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import Spinner from "../../components/Spinner";
import Notifycenter from "../../components/Notifycenter";

import {
  enrollCourse,
  selectSchool,
  clearMessage,
} from "../../redux/slice/student";
import { fetchSchools } from "../../redux/slice/teacherReqSlice"; // assuming same API for schools

export default function Student() {
  const dispatch = useDispatch();

  const { schools, loading: schoolsLoading } = useSelector(
    (state) => state.teacherReq
  );
  const {
    enrolledCourses,
    selectedSchools,
    loading: studentLoading,
    message,
    error,
  } = useSelector((state) => state.student);

  /* =======================
     Load Schools
  ======================= */
  useEffect(() => {
    dispatch(fetchSchools());
  }, [dispatch]);

  /* =======================
     Show messages
  ======================= */
  useEffect(() => {
    if (message) {
      Swal.fire("Success", message, "success");
      dispatch(clearMessage());
    }
    if (error) {
      Swal.fire("Error", error, "error");
    }
  }, [message, error, dispatch]);

  /* =======================
     Handlers
  ======================= */
  const handleSelectSchool = (schoolId) => {
    dispatch(selectSchool({ schoolId }));
  };

  const handleEnrollCourse = (courseId) => {
    dispatch(enrollCourse({ courseId }));
  };

  if (schoolsLoading === "loading" || studentLoading === "loading") return <Spinner />;

  return (
    <div className="p-6">
 
      <h2 className="text-2xl font-bold mb-5">Student Dashboard</h2>

      {schools.length === 0 && <p>No schools available.</p>}

      {schools.map((school) => {
        const isSchoolSelected = selectedSchools.includes(school._id);

        return (
          <div
            key={school._id}
            className="border p-4 rounded mb-4 shadow-sm"
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold">{school.name}</h3>
              {!isSchoolSelected ? (
                <button
                  onClick={() => handleSelectSchool(school._id)}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Select School
                </button>
              ) : (
                <span className="text-green-600 font-semibold">
                  School Selected
                </span>
              )}
            </div>

            {/* COURSES */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {school.courses?.map((course) => {
                const isEnrolled = enrolledCourses.includes(course._id);
                return (
                  <div
                    key={course._id}
                    className="flex items-center justify-between border px-4 py-2 rounded shadow hover:shadow-md transition"
                  >
                    <span className="font-medium">{course.name}</span>
                    {!isSchoolSelected ? (
                      <span className="text-gray-400">Select school first</span>
                    ) : isEnrolled ? (
                      <span className="text-green-600 font-semibold">
                        Enrolled
                      </span>
                    ) : (
                      <button
                        onClick={() => handleEnrollCourse(course._id)}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        Enroll
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
