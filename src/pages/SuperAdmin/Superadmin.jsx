import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSchools, fetchUsers } from "../../redux/slice/schoolSlice"; // or schoolSlice if separate
import Spinner from "../../components/Spinner";

export default function SuperAdminContent() {
  const dispatch = useDispatch();
  const { schools, users, loading, error } = useSelector((state) => state.school);

  // Fetch schools and users on mount
  useEffect(() => {
    dispatch(fetchSchools());
    dispatch(fetchUsers()); 
  }, [dispatch]);

  if (loading === "loading") {
    return (
    <Spinner />
    );
  }

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6 bg-gray-100">
      {/* Dashboard Header */}
      <h1 className="text-4xl font-bold text-blue-600 mb-6">
        SuperAdmin Dashboard
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {/* Total Schools */}
        <div className="bg-blue-100 p-6 rounded-xl shadow text-center">
          <h2 className="text-lg font-semibold text-gray-800">Total Schools</h2>
          <p className="text-4xl font-bold text-blue-700 mt-2">{schools.length}</p>
        </div>

        {/* Total Users */}
        <div className="bg-blue-100 p-6 rounded-xl shadow text-center">
          <h2 className="text-lg font-semibold text-gray-800">Total Users</h2>
          <p className="text-4xl font-bold text-blue-700 mt-2">{users.length}</p>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-3 text-gray-700">
          Recent Activities
        </h2>
        <div className="bg-white p-6 rounded-xl shadow min-h-[150px]">
          No activities yet.
        </div>
      </div>
    </div>
  );
}
