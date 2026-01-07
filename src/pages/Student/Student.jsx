// Student.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import Spinner from "../../components/Spinner";
import { useNavigate } from "react-router-dom";

import {
  selectSchool,
  clearMessage,
  fetchStudentState,
} from "../../redux/slice/student";
import { fetchSchools } from "../../redux/slice/teacherReqSlice";

export default function Student() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  // Local state for optimistic UI
  const [localEnrolled, setLocalEnrolled] = useState([]);
  const [localSelected, setLocalSelected] = useState([]);

  useEffect(() => {
    dispatch(fetchSchools());
    dispatch(fetchStudentState());
  }, [dispatch]);

  useEffect(() => {
    if (message) {
      Swal.fire("Success", message, "success");
      dispatch(clearMessage());
    }
    if (error) Swal.fire("Error", error, "error");
  }, [message, error, dispatch]);

  const handleSelectSchool = (schoolId) => {
    setLocalSelected((prev) => [...prev, schoolId]);
    dispatch(selectSchool({ schoolId }))
      .unwrap()
      .then(() => {
        dispatch(fetchStudentState());
      })
      .catch(() => {
        setLocalSelected((prev) => prev.filter((id) => id !== schoolId));
      });
  };

  // ----------------- Enroll Course -----------------
  const handleEnrollCourse = async (course) => {
    try {
      // 1️⃣ Free course → enroll immediately
      if (course.price === 0) {
        await fetch("http://localhost:4000/api/student/enroll", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ courseId: course._id }),
        });

        setLocalEnrolled((prev) => [...prev, course._id]);
        Swal.fire("Enrolled", "You are enrolled in this free course!", "success");
        return;
      }

      // 2️⃣ Paid course → create Stripe session
      const res = await fetch(
        "http://localhost:4000/api/stripe/create-checkout-session",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ courseId: course._id }),
        }
      );

      const data = await res.json();

      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        Swal.fire("Error", data.message || "Failed to create payment session", "error");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Something went wrong", "error");
    }
  };

  // ----------------- Loading state -----------------
  if (schoolsLoading === "loading" || studentLoading === "loading") return <Spinner />;

  return (
    <div className="p-6 flex flex-col bg-amber-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-amber-700">Student Dashboard</h2>

      {schools.map((school) => {
        const isSchoolSelected =
          selectedSchools.includes(school._id) || localSelected.includes(school._id);

        return (
          <div
            key={school._id}
            className="bg-white rounded-2xl shadow-md p-5 mb-5 hover:shadow-xl transition"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">{school.name}</h3>
              {!isSchoolSelected ? (
                <button
                  onClick={() => handleSelectSchool(school._id)}
                  className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-xl transition cursor-pointer"
                >
                  Select School
                </button>
              ) : (
                <span className="text-green-600 font-semibold">School Selected</span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {school.courses?.map((course) => {
                const isEnrolled =
                  enrolledCourses.includes(course._id) || localEnrolled.includes(course._id);

                return (
                  <div
                    key={course._id}
                    className="flex justify-between items-center border p-3 rounded-lg hover:shadow-sm transition bg-amber-50"
                  >
                    <span>{course.name}</span>

                    {!isSchoolSelected ? (
                      <span className="text-gray-400 text-sm">Select school first</span>
                    ) : isEnrolled ? (
                      <span className="text-green-600 font-semibold">Enrolled</span>
                    ) : (
                      <button
                        onClick={() => handleEnrollCourse(course)}
                        className="px-2 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-xl transition cursor-pointer"
                      >
                        {course.price === 0 ? "free" : " Paid"}
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
