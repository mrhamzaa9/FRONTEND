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

  // Store selected courses per request (request._id)
  const [selectedCourses, setSelectedCourses] = useState({}); 

  // Store assigned courses per school to prevent conflicts
  const [assignedCourses, setAssignedCourses] = useState({}); // schoolId -> [courseIds]

  useEffect(() => {
    dispatch(fetchTeacherRequests());
    dispatch(fetchSchools());
  }, [dispatch]);

  useEffect(() => {
    // Build assigned courses map
    const map = {};
    schools.forEach((school) => {
      map[school._id] = school.teachers?.flatMap((t) =>
        t.courseIds.map((c) => c._id)
      ) || [];
    });
    setAssignedCourses(map);
  }, [schools]);

  const handleCourseChange = (requestId, courseId) => {
    setSelectedCourses((prev) => {
      const existing = prev[requestId] || [];
      if (existing.includes(courseId)) {
        return { ...prev, [requestId]: existing.filter((id) => id !== courseId) };
      }
      return { ...prev, [requestId]: [...existing, courseId] };
    });
  };

  const handleApprove = async (teacherRequest) => {
    const schoolId = teacherRequest.schoolId;
    const teacherId = teacherRequest.teacherId;
    const courses = selectedCourses[teacherRequest._id] || [];

    // Check if any selected course is already assigned
    const overlap = courses.filter((c) => assignedCourses[schoolId]?.includes(c));
    if (overlap.length > 0) {
      return Swal.fire(
        "Error",
        `Course(s) ${overlap.join(", ")} already assigned to another teacher`,
        "error"
      );
    }

    try {
      await dispatch(
        processTeacherRequest({ teacherId, approve: true, schoolId, courseIds: courses })
      ).unwrap();

      Swal.fire("Approved!", `${teacherRequest.name} approved`, "success");
      dispatch(fetchTeacherRequests());
    } catch (err) {
      Swal.fire("Error", err.message || "Something went wrong", "error");
    }
  };

  const handleReject = async (teacherRequest) => {
    const schoolId = teacherRequest.schoolId;
    const teacherId = teacherRequest.teacherId;

    try {
      await dispatch(
        processTeacherRequest({ teacherId, approve: false, schoolId })
      ).unwrap();

      Swal.fire("Rejected!", `${teacherRequest.name} rejected`, "info");
      dispatch(fetchTeacherRequests());
    } catch (err) {
      Swal.fire("Error", err.message || "Something went wrong", "error");
    }
  };

  return (
    <div>
      <Notification />
      <h2 className="text-xl font-bold mb-4">Teacher Requests</h2>

      {loading === "loading" && <p>Loading...</p>}
      {requests.length === 0 && <p>No pending requests</p>}

      {requests.map((teacher) => (
        <div key={teacher._id} className="border p-3 mb-2 rounded">
          <p>{teacher.name} ({teacher.email})</p>
          <p className="text-sm text-gray-600">School ID: {teacher.schoolId}</p>

          <div className="mb-2">
            <p>Selected Courses: {teacher.courseIds?.length > 0
                ? teacher.courseIds.map((c) => c.name).join(", ")
                : "No courses submitted"}</p>

            {/* Courses checkboxes */}
            {teacher.courseIds?.map((course) => (
              <label key={course._id} className="mr-2">
                <input
                  type="checkbox"
                  disabled={assignedCourses[teacher.schoolId]?.includes(course._id)}
                  checked={(selectedCourses[teacher._id] || []).includes(course._id)}
                  onChange={() => handleCourseChange(teacher._id, course._id)}
                />
                {course.name}
              </label>
            ))}
          </div>

          <button
            onClick={() => handleApprove(teacher)}
            className="bg-green-500 text-white px-3 py-1 rounded mr-2"
          >
            Approve
          </button>

          <button
            onClick={() => handleReject(teacher)}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Reject
          </button>
        </div>
      ))}
    </div>
  );
}
