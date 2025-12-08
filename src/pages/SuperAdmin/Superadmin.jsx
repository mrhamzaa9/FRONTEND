import React, { useEffect, useState } from "react";

export default function SuperAdminContent() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:4000/api/superadmin/`, {
      credentials: "include",
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

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
          <p className="text-4xl font-bold text-blue-700 mt-2">{users.length}</p>
        </div>
         {/* Total USER */}
        <div className="bg-blue-100 p-6 rounded-xl shadow text-center">
          <h2 className="text-lg font-semibold text-gray-800">Total Users</h2>
          <p className="text-4xl font-bold text-blue-700 mt-2">9</p>
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
