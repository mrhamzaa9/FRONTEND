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

  // Store selected courses per teacher
  const [selectedCourses, setSelectedCourses] = useState({}); // teacherId -> [courseIds]

  useEffect(() => {
    dispatch(fetchTeacherRequests());
    dispatch(fetchSchools()); // load courses for selection
  }, [dispatch]);
useEffect(() => {
  console.log("Teacher requests from Redux:", requests);
}, [requests]);

  // Handle course checkbox changes
  const handleCourseChange = (teacherId, courseId) => {
    setSelectedCourses((prev) => {
      const existing = prev[teacherId] || [];
      if (existing.includes(courseId)) {
        return { ...prev, [teacherId]: existing.filter((id) => id !== courseId) };
      }
      return { ...prev, [teacherId]: [...existing, courseId] };
    });
  };

  // Approve teacher
const handleApprove = async (teacherRequest) => {
  const schoolId = teacherRequest.schoolId;
  const teacherId = teacherRequest.teacherId; // ✅ FIX
  const courses = selectedCourses[teacherRequest._id] || [];

  try {
    await dispatch(
      processTeacherRequest({
        teacherId,
        approve: true,
        schoolId,
        courseIds: courses
      })
    ).unwrap();

    Swal.fire("Approved!", `${teacherRequest.name} approved`, "success");
    dispatch(fetchTeacherRequests());
  } catch (err) {
    Swal.fire("Error", err.message || "Something went wrong", "error");
  }
};


  // Reject teacher
  const handleReject = async (teacherRequest) => {
  const schoolId = teacherRequest.schoolId;
  const teacherId = teacherRequest.teacherId; // ✅ FIX
const courses = selectedCourses[teacherRequest._id] || [];
  try {
    await dispatch(
      processTeacherRequest({
        teacherId,
        approve: false,
        schoolId,
        courseIds: courses 
      })
    ).unwrap();

    Swal.fire("Rejected!", `${teacherRequest.name} rejected`, "info");
    dispatch(fetchTeacherRequests());
  } catch (err) {
    Swal.fire("Error", err.message || "Something went wrong", "error");
  }
};


  return (
    <div>
      <Notification/>
      <h2 className="text-xl font-bold mb-4">Teacher Requests</h2>

      {loading === "loading" && <p>Loading...</p>}
      {requests.length === 0 && <p>No pending requests</p>}

      {requests.map((teacher) => (
        <div key={teacher._id} className="border p-3 mb-2 rounded">
          <p>
            {teacher.name} ({teacher.email})
          </p>

          <p className="text-sm text-gray-600">School ID: {teacher.schoolId}</p>

        <div className="mb-2">
  <p>
    Selected Courses:{" "}
    {teacher.courseIds?.length > 0
      ? teacher.courseIds.map((c) => c.name).join(", ")
      : "No courses submitted"}
  </p>
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
