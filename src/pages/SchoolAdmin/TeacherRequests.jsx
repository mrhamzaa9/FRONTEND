import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import {
  fetchTeacherRequests,
  processTeacherRequest,
} from "../../redux/slice/teacherSlice";
import { fetchSchools } from "../../redux/slice/schoolSlice";
import Notification from "../../components/Notification";

export default function TeacherRequests() {
  const dispatch = useDispatch();
  const { requests, loading } = useSelector((state) => state.teacher);
  const { schools } = useSelector((state) => state.school);

  const [selectedCourses, setSelectedCourses] = useState({});
  const [assignedCourses, setAssignedCourses] = useState({});

  useEffect(() => {
    dispatch(fetchTeacherRequests());
    dispatch(fetchSchools());
  }, [dispatch]);

  // map assigned courses
  useEffect(() => {
    const map = {};
    schools.forEach((school) => {
      map[school._id] =
        school.teachers?.flatMap((t) =>
          (t.courseIds || []).map((c) => c._id || c)
        ) || [];
    });
    setAssignedCourses(map);
  }, [schools]);

  const toggleCourse = (requestId, courseId) => {
    setSelectedCourses((prev) => {
      const existing = prev[requestId] || [];
      return {
        ...prev,
        [requestId]: existing.includes(courseId)
          ? existing.filter((id) => id !== courseId)
          : [...existing, courseId],
      };
    });
  };

  const handleApprove = async (req) => {
    const courses = selectedCourses[req._id] || [];

    const overlap = courses.filter((c) =>
      assignedCourses[req.schoolId]?.includes(c)
    );

    if (overlap.length > 0) {
      return Swal.fire(
        "Error",
        "One or more selected courses are already assigned",
        "error"
      );
    }

    try {
      await dispatch(
        processTeacherRequest({
          requestId: req._id,
          teacherId: req.teacherId,
          approve: true,
          schoolId: req.schoolId,
          courseIds: courses,
        })
      ).unwrap();

      Swal.fire("Approved!", "Teacher approved successfully", "success");
    } catch (err) {
      Swal.fire("Error", err || "Something went wrong", "error");
    }
  };

  const handleReject = async (req) => {
    try {
      await dispatch(
        processTeacherRequest({
          requestId: req._id,
          teacherId: req.teacherId,
          approve: false,
          schoolId: req.schoolId,
        })
      ).unwrap();

      Swal.fire("Rejected!", "Teacher request rejected", "info");
    } catch (err) {
      Swal.fire("Error", err || "Something went wrong", "error");
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 min-h-screen">
      <Notification />

      <h2 className="text-3xl font-bold mb-6 text-amber-700">
        Teacher Requests
      </h2>

      {loading === "loading" && <p>Loading...</p>}
      {requests.length === 0 && <p>No pending requests</p>}

      {requests.map((req) => (
        <div
          key={req._id}
          className="bg-white rounded-2xl shadow-xl p-4 mb-4"
        >
          <p className="font-semibold">
            {req.name} ({req.email})
          </p>

          <div className="my-2">
            {req.courseIds?.map((course) => (
              <label key={course._id} className="mr-3">
                <input
                  type="checkbox"
                  className="mr-1 cursor-pointer"
                  disabled={assignedCourses[req.schoolId]?.includes(course._id)}
                  checked={(selectedCourses[req._id] || []).includes(
                    course._id
                  )}
                  onChange={() => toggleCourse(req._id, course._id)}
                />
                {course.name}
              </label>
            ))}
          </div>

          <button
            onClick={() => handleApprove(req)}
            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded mr-2"
          >
            Approve
          </button>

          <button
            onClick={() => handleReject(req)}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
          >
            Reject
          </button>
        </div>
      ))}
    </div>
  );
}
