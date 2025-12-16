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
import Notification from "../../components/Notification";

export default function TeacherDashboard() {
  const dispatch = useDispatch();
  const { schools, loading, requested, message, error } = useSelector(
    (state) => state.teacherReq
  );

  const [selectedCourses, setSelectedCourses] = useState({});

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

  const isCourseRequested = (schoolId, courseId) =>
    requested?.[schoolId]?.includes(courseId);

  const handleCourseChange = (schoolId, courseId) => {
    setSelectedCourses((prev) => {
      const existing = prev[schoolId] || [];

      return {
        ...prev,
        [schoolId]: existing.includes(courseId)
          ? existing.filter((id) => id !== courseId)
          : [...existing, courseId],
      };
    });
  };

  const handleRequest = (schoolId, courseId) => {
    dispatch(requestToJoinSchool({ schoolId, courseIds: [courseId] }));

    // clear local selection after request
    setSelectedCourses((prev) => ({
      ...prev,
      [schoolId]: prev[schoolId]?.filter((id) => id !== courseId) || [],
    }));
  };

  const handleCancelCourse = (schoolId, courseId) => {
    dispatch(cancelRequest({ schoolId, courseId }));
  };

  if (loading === "loading") return <Spinner />;

  return (
    <div className="p-6">
                          <Notification/>
      <h2 className="text-2xl font-bold mb-5">Teacher Dashboard</h2>

      <h3 className="text-xl font-semibold mb-3">Available Schools</h3>
      {schools.length === 0 && <p>No schools found.</p>}

      {schools.map((school) => {
        const selected = selectedCourses[school._id] || [];

        return (
          <div key={school._id} className="border p-4 rounded mb-4 shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <span className="font-medium text-lg">{school.name}</span>
            </div>

            {/* COURSES */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {school.courses?.map((course) => {
                const requestedCourse = isCourseRequested(
                  school._id,
                  course._id
                );

                const selectedCourse = selected.includes(course._id);

                return (
                  

                  <div
                
                    key={course._id}
                    className="flex items-center justify-between border px-4 py-2 rounded shadow hover:shadow-md transition"
                  >
                    <span className="font-medium">{course.name}</span>

                    <div className="flex items-center justify-between  gap-2">
                      {requestedCourse ? (
                        <button
                          onClick={() =>
                            handleCancelCourse(school._id, course._id)
                          }
                          className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                        >
                          Delete
                        </button>
                      ) : (
                        <button
                          onClick={() => handleRequest(school._id, course._id)}
                          className={`px-3 py-1 rounded text-sm ${
                            selectedCourse
                              ? "bg-blue-500 text-white hover:bg-blue-600"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                        >
                          {selectedCourse ? "Request" : "Select"}
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
    
  );
}
