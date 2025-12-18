import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMySchool } from "../../redux/slice/schoolSlice";
import Spinner from "../../components/Spinner";

export default function SchoolAdminDashboard() {
  const dispatch = useDispatch();
  const { mySchool, loading, error } = useSelector(
    (state) => state.school
  );

  useEffect(() => {
  
    dispatch(fetchMySchool());
     
  }, [dispatch]);
 console.log(mySchool)
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <h2 className="text-blue-600 text-4xl font-bold mb-6">
        School Admin Dashboard
      </h2>

      {/* Loading */}
      {loading === "loading" && <Spinner />}

      {/* Error */}
      {error && <p className="text-red-500">{error}</p>}

      {mySchool.length === 0 && loading !== "loading" && (
        <p className="text-gray-500">No school found.</p>
      )}

      {mySchool.map((school) => (
        <div
          key={school._id}
          className="bg-white shadow-lg rounded-xl p-8 max-w-3xl"
        >
          {/* School Name */}
          <h3 className="text-3xl font-semibold text-gray-800 mb-6">
            {school.name}
          </h3>

    {/* ================= STUDENTS ================= */}
<div className="mt-6">
  <h4 className="text-xl font-semibold text-gray-700 mb-3">
    Students
  </h4>

  {(!school.students || school.students.length === 0) ? (
    <p className="text-gray-500">No students enrolled yet.</p>
  ) : (
    <ul className="list-disc list-inside space-y-1">
      {school.students.map((student) => (
        <li key={student._id} className="text-gray-800">
          {student.name || student.email}
        </li>
      ))}
    </ul>
  )}
</div>


          {/* ================= COURSES ================= */}
          <div>
            <h4 className="text-xl font-semibold text-gray-700 mb-3">
              Courses
            </h4>

            {(!school.courses || school.courses.length === 0) ? (
              <p className="text-gray-500">No courses created yet.</p>
            ) : (
              <ul className="list-disc list-inside space-y-1">
                {school.courses.map((course) => (
                  <li key={course._id} className="text-gray-800">
                    {course.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
