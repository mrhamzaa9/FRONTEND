import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { fetchTeacherRequests, processTeacherRequest } from "../../redux/slice/teacherSlice";
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

  useEffect(() => {
    const map = {};
    schools.forEach((school) => {
      map[school._id] = school.teachers?.flatMap((t) => t.courseIds.map((c) => c._id)) || [];
    });
    setAssignedCourses(map);
  }, [schools]);

  const handleCourseChange = (requestId, courseId) => {
    setSelectedCourses(prev => {
      const existing = prev[requestId] || [];
      if (existing.includes(courseId)) return { ...prev, [requestId]: existing.filter(id => id !== courseId) };
      return { ...prev, [requestId]: [...existing, courseId] };
    });
  };

  const handleApprove = async (teacherRequest) => {
    const schoolId = teacherRequest.schoolId;
    const teacherId = teacherRequest.teacherId;
    const courses = selectedCourses[teacherRequest._id] || [];
    const overlap = courses.filter(c => assignedCourses[schoolId]?.includes(c));
    if (overlap.length > 0) return Swal.fire("Error", `Course(s) ${overlap.join(", ")} already assigned`, "error");

    try {
      await dispatch(processTeacherRequest({ teacherId, approve: true, schoolId, courseIds: courses })).unwrap();
      Swal.fire("Approved!", `${teacherRequest.name} approved`, "success");
      dispatch(fetchTeacherRequests());
    } catch (err) { Swal.fire("Error", err.message || "Something went wrong", "error"); }
  };

  const handleReject = async (teacherRequest) => {
    try {
      await dispatch(processTeacherRequest({ teacherId: teacherRequest.teacherId, approve: false, schoolId: teacherRequest.schoolId })).unwrap();
      Swal.fire("Rejected!", `${teacherRequest.name} rejected`, "info");
      dispatch(fetchTeacherRequests());
    } catch (err) { Swal.fire("Error", err.message || "Something went wrong", "error"); }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 min-h-screen">
      <Notification />
      <h2 className="text-3xl font-bold mb-6 text-amber-700">Teacher Requests</h2>

      {loading === "loading" && <p>Loading...</p>}
      {requests.length === 0 && <p className="text-gray-500">No pending requests</p>}

      {requests.map(teacher => (
        <div key={teacher._id} className="bg-white rounded-2xl shadow-xl p-4 mb-4">
          <p className="font-semibold">{teacher.name} ({teacher.email})</p>
          <p className="text-sm text-gray-600 mb-2">School ID: {teacher.schoolId}</p>

          <div className="mb-2">
            <p className="text-gray-700">Selected Courses: {teacher.courseIds?.length > 0 ? teacher.courseIds.map(c => c.name).join(", ") : "No courses submitted"}</p>
            {teacher.courseIds?.map(course => (
              <label key={course._id} className="mr-2">
                <input
                  type="checkbox"
                  disabled={assignedCourses[teacher.schoolId]?.includes(course._id)}
                  checked={(selectedCourses[teacher._id] || []).includes(course._id)}
                  onChange={() => handleCourseChange(teacher._id, course._id)}
                  className="mr-1 cursor-pointer"
                />
                {course.name}
              </label>
            ))}
          </div>

          <button onClick={() => handleApprove(teacher)} className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded mr-2 cursor-pointer transition">Approve</button>
          <button onClick={() => handleReject(teacher)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded cursor-pointer transition">Reject</button>
        </div>
      ))}
    </div>
  );
}
