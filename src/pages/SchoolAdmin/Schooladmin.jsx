
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/auth";
import { Link, useNavigate } from "react-router-dom";
export default function Schooladmin() {
  const [users, setUsers] = useState([]);
  const { logout } = useAuth();

 
  useEffect(() => {
    fetch(`http://localhost:4000/api/superadmin`, { credentials: "include", method: "GET" })
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);
   
  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* Top Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-blue-600 text-4xl font-bold">School Admin Dashboard</h2>

        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition-all cursor-pointer"
        >
          Logout
        </button>
         <button className="border-y-indigo-500 text-white px-4 py-2 rounded-lg shadow hover:border-y-indigo-500 transition-all no-">
        <Link to="/create-school" className="text-blue-500">
          MAKE SCHOOL
        </Link>
        </button>
      </div>

      {/* Sub Heading */}
      <p className="text-gray-600 text-lg mb-6">Manage all registered users in your school.</p>

      {/* User Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((u) => (
          <div
            key={u._id}
            className="bg-white shadow-lg rounded-xl p-6 hover:shadow-xl transition transform hover:-translate-y-1"
          >
            <div className="flex flex-col gap-3">
              <h3 className="text-xl font-semibold text-gray-800"> SCHOOL NAME : {u.name}</h3>
            </div>

            <div className="mt-5">

            </div>
          </div>
        ))}
      </div>

    </div>
  );
}