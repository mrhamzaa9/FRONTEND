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
      .then(() => dispatch(fetchStudentState()))
      .catch(() =>
        setLocalSelected((prev) => prev.filter((id) => id !== schoolId))
      );
  };

  // ----------------- Enroll Course -----------------
  const handleEnrollCourse = async (course) => {
    const price = Number(course.price || 0);
    console.log("Enroll clicked:", course.name, "Price:", price);

    // ----- FREE COURSE -----
    if (price === 0) {
      try {
        const res = await fetch("http://localhost:4000/api/enroll", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ courseId: course._id }),
        });

        const data = await res.json();
        if (res.ok) {
          setLocalEnrolled((prev) => [...prev, course._id]);
          Swal.fire("Enrolled", "You are enrolled in this free course!", "success");
        } else {
          Swal.fire("Error", data.message || "Enrollment failed", "error");
        }
      } catch (err) {
        Swal.fire("Error", "Something went wrong during free enrollment", "error");
      }
      return;
    }

    // ----- PAID COURSE -----
    try {
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
        window.location.href = data.url; // redirect to Stripe checkout
      } else {
        Swal.fire("Error", data.message || "Failed to create payment session", "error");
      }
    } catch (err) {
      Swal.fire("Error", "Something went wrong while creating Stripe session", "error");
    }
  };

  if (schoolsLoading === "loading" || studentLoading === "loading") return <Spinner />;


return (
  <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-6">
    <h2 className="text-4xl font-bold text-amber-800 mb-8">
      🎓 Student Dashboard
    </h2>

    <div className="space-y-8">
      {schools.map((school) => {
        const isSchoolSelected =
          selectedSchools.includes(school._id) ||
          localSelected.includes(school._id);

        return (
          <div
            key={school._id}
            className="bg-white rounded-3xl shadow-lg p-6 border border-amber-100"
          >
            {/* School Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <h3 className="text-2xl font-semibold text-gray-800">
                🏫 {school.name}
              </h3>

              {!isSchoolSelected ? (
                <button
                  onClick={() => handleSelectSchool(school._id)}
                  className="mt-3 md:mt-0 px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-full font-medium transition"
                >
                  Select School
                </button>
              ) : (
                <span className="mt-3 md:mt-0 text-green-600 font-semibold">
                  ✔ School Selected
                </span>
              )}
            </div>

            {/* Courses */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {school.courses?.map((course) => {
                const price = Number(course.price || 0);
                const isEnrolled =
                  enrolledCourses.includes(course._id) ||
                  localEnrolled.includes(course._id);

                return (
                  <div
                    key={course._id}
                    className="bg-amber-50 rounded-2xl p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition"
                  >
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800">
                        {course.name}
                      </h4>

                      <span
                        className={`inline-block mt-2 px-3 py-1 text-sm rounded-full font-medium
                          ${
                            price === 0
                              ? "bg-green-100 text-green-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                      >
                        {price === 0 ? "Free Course" : `$${price}`}
                      </span>
                    </div>

                    <div className="mt-4">
                      {!isSchoolSelected ? (
                        <button
                          disabled
                          className="w-full py-2 rounded-xl bg-gray-200 text-gray-500 cursor-not-allowed"
                        >
                          Select school first
                        </button>
                      ) : isEnrolled ? (
                        <button
                          disabled
                          className="w-full py-2 rounded-xl bg-green-100 text-green-700 font-semibold cursor-not-allowed"
                        >
                          Enrolled ✔
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEnrollCourse(course)}
                          className="w-full py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-medium transition"
                        >
                          {price === 0 ? "Enroll Free" : "Buy Course"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

  
}
