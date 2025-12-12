import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSchools } from "../../redux/slice/schoolSlice";
import Spinner from "../../components/Spinner";

export default function SchoolAdminDashboard() {
  const dispatch = useDispatch();
  const { schools, loading, error } = useSelector((state) => state.school);

  useEffect(() => {
    dispatch(fetchSchools());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-blue-600 text-4xl font-bold">
          School Admin Dashboard
        </h2>
      </div>

      {/* Subheading */}
      <p className="text-gray-600 text-lg mb-6">
        Manage your schools and courses.
      </p>

      {/* Loading/Error */}
      {loading === "loading" && <Spinner />}
      {error && <p className="text-red-500">{error}</p>}

      {/* Schools & Courses */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {schools.length === 0 && loading !== "loading" && (
          <p className="text-red-500">No schools found for your account.</p>
        )}

        {schools.map((school) => (
          <div
            key={school._id}
            className="bg-white shadow-lg rounded-xl p-6 hover:shadow-xl transition transform hover:-translate-y-1"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              School: {school.name}
            </h3>

            <h4 className="text-lg font-semibold text-gray-700 mb-2">
              Courses:
            </h4>

            {/* Courses list */}
            {(!school.courses || school.courses.length === 0) ? (
              <p className="text-gray-500">No courses created yet.</p>
            ) : (
              <ul className="list-disc list-inside">
                {school.courses.map((course) => (
                  <li key={course._id} className="text-gray-800">
                    {course.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
