
import React, { useEffect, useState } from "react";
import { data, useNavigate } from "react-router-dom";
import { MdOutlineDelete } from "react-icons/md";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../../redux/slice/schoolSlice";
import Spinner from "../../components/Spinner";


export default function ViewUser() {
      const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.school);

  // Fetch users on mount
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);
  
    if (loading === "loading") {
      return (
      <Spinner/>
      );
    }
  
    if (error) return <p className="text-red-500">{error}</p>;
    return (
        <div className="min-h-screen bg-amber-100 p-6">
            {/* Top Header */}
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-amber-600 text-4xl font-bold">Super Admin Dashboard</h2>
            </div>

            {/* Sub Heading */}
            <p className="text-amber-800 text-lg mb-6">Manage all registered users.</p>
            {/* User Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {users.map((u) => (
                    <div
                        key={u._id}
                        className="bg-white border-2 border-amber-300 shadow-lg rounded-xl p-6 hover:shadow-xl transition transform hover:-translate-y-1"
                    >
                        <div className="flex flex-col gap-3">
                            <h3 className="bg-white border-2 border-amber-300 shadow-lg rounded-xl p-6 hover:shadow-xl transition transform hover:-translate-y-1">  NAME:{u.name}</h3>
                             <h3 className="bg-white border-2 border-amber-300 shadow-lg rounded-xl p-6 hover:shadow-xl transition transform hover:-translate-y-1"> ROLE :{u.role}</h3>
                               <h3 className="bg-white border-2 border-amber-300 shadow-lg rounded-xl p-6 hover:shadow-xl transition transform hover:-translate-y-1">EMAIL: {u.email}</h3>
                             
                            
                        </div>
                        </div>
                    
                ))}
            </div>


        </div>
    );
}