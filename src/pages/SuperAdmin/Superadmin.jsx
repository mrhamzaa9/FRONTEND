import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSchools, fetchUsers } from "../../redux/slice/schoolSlice";
import Spinner from "../../components/Spinner";

export default function SuperAdminContent() {
  const dispatch = useDispatch();
  const { schools, users, loading, error } = useSelector((state) => state.school);

  useEffect(() => {
    dispatch(fetchSchools());
    dispatch(fetchUsers());
  }, [dispatch]);

  if (loading === "loading") return <Spinner />;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6 bg-amber-50 min-h-screen">
      {/* Dashboard Header */}
      <h1 className="text-4xl font-bold text-amber-700 mb-6">
        SuperAdmin Dashboard
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {/* Total Schools */}
        <div className="bg-white border-2 border-amber-300 p-6 rounded-xl shadow text-center">
          <h2 className="text-lg font-semibold text-amber-800">Total Schools</h2>
          <p className="text-4xl font-bold text-amber-900 mt-2">{schools.length}</p>
        </div>

        {/* Total Users */}
        <div className="bg-white border-2 border-amber-300 p-6 rounded-xl shadow text-center">
          <h2 className="text-lg font-semibold text-amber-800">Total Users</h2>
          <p className="text-4xl font-bold text-amber-900 mt-2">{users.length}</p>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-3 text-amber-800">
          Recent Activities
        </h2>
        <div className="bg-white border-2 border-amber-300 p-6 rounded-xl shadow min-h-[150px]">
          No activities yet.
        </div>
      </div>
    </div>
  );
}
