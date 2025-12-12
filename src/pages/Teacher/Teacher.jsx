import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import Spinner from "../../components/Spinner";
import {
  fetchSchools,
  requestToJoinSchool,
  clearMessage,
  cancelRequest,
} from "../../redux/slice/teacherReqSlice";

export default function TeacherDashboard() {
  const dispatch = useDispatch();
  const { schools, loading, requested, message, error } = useSelector(
    (state) => state.teacherReq
  );

  // store selected courses per school
  const [selectedCourses, setSelectedCourses] = useState({}); // schoolId -> [courseIds]
const handleCancel = (schoolId) => {
  dispatch(cancelRequest(schoolId));
};
  useEffect(() => {
    dispatch(fetchSchools());
  }, [dispatch]);

  useEffect(() => {
    if (message) {
      Swal.fire("Info", message, "success");
      dispatch(clearMessage());
    }
    if (error) {
      Swal.fire("Error", error, "error");
    }
  }, [message, error, dispatch]);

  // toggle course selection for a school
  const handleCourseChange = (schoolId, courseId) => {
    setSelectedCourses((prev) => {
      const existing = prev[schoolId] || [];
      if (existing.includes(courseId)) {
        return { ...prev, [schoolId]: existing.filter((id) => id !== courseId) };
      }
      return { ...prev, [schoolId]: [...existing, courseId] };
    });
  };

  // send request with selected courses
  const handleRequest = (schoolId) => {
    const coursesForSchool = selectedCourses[schoolId] || [];
    if (coursesForSchool.length === 0) {
      return Swal.fire("Warning", "Select at least one course", "warning");
    }

    dispatch(requestToJoinSchool({ schoolId, courseIds: coursesForSchool }));
  };

  if (loading === "loading") return <Spinner />;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-5">Teacher Dashboard</h2>

      <h3 className="text-xl font-semibold mb-3">Available Schools</h3>
      {schools.length === 0 && <p>No schools found.</p>}

      {schools.map((school) => {
        const alreadyRequested = requested.includes(school._id);
        const coursesForSchool = selectedCourses[school._id] || [];

        return (
          <div key={school._id} className="border p-4 rounded mb-3">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">{school.name}</span>
              <button
                className={`px-3 py-1 rounded ${
                  alreadyRequested
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
                onClick={() => handleRequest(school._id)}
                disabled={alreadyRequested}
              >
                {alreadyRequested ? "Request Sent" : "Request to Join"}
              </button>
              {alreadyRequested && (
                <button
                  className="ml-2 px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600"   
                  onClick={() => handleCancel(school._id)}
                >
                  Cancel Request
                </button>
              )}
            </div>

            {/* Course selection */}
            <div className="flex flex-wrap gap-2">
              {school.courses?.map((course) => (
                <label key={course._id} className="mr-3">
                  <input
                    type="checkbox"
                    value={course._id}
                    checked={coursesForSchool.includes(course._id)}
                    onChange={() => handleCourseChange(school._id, course._id)}
                    disabled={alreadyRequested}
                  />{" "}
                  {course.name}
                </label>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
