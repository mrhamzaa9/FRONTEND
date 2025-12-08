
import React, { useEffect, useState } from "react";
import { data, useNavigate } from "react-router-dom";
import { MdOutlineDelete } from "react-icons/md";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { fetchSchools } from "../../redux/slice/schoolSlice";
import Spinner from "../../components/Spinner";


export default function ViewSchool() {
    const dispatch = useDispatch();
  const { schools, loading, error } = useSelector((state) => state.school);

  // Fetch schools on mount
  useEffect(() => {
    dispatch(fetchSchools());
  }, [dispatch]);
   if (loading === "loading") {
      return (
      <Spinner/>
      );
    }
  
    if (error) return <p className="text-red-500">{error}</p>;
    return (
        <div className="min-h-screen bg-gray-100 p-6">
            {/* Top Header */}
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-blue-600 text-4xl font-bold">Super Admin Dashboard</h2>
            </div>

            {/* Sub Heading */}
            <p className="text-gray-600 text-lg mb-6">Manage all registered  school.</p>

            {/* User Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {schools.map((u) => (
                    <div
                        key={u._id}
                        className="bg-white shadow-lg rounded-xl p-6 hover:shadow-xl transition transform hover:-translate-y-1"
                    >
                        <div className="flex flex-col gap-3">
                            <h3 className="text-xl font-semibold text-gray-800"> SCHOOL NAME:{u.name}</h3>
                             <h3 className="text-xl font-semibold text-gray-800"> CREATEDBY :{u.createdBy?.name}</h3>
                               <h3 className="text-xl font-semibold text-gray-800">EMIAL: {u.createdBy?.email}</h3>
                             
                        </div>
                        </div>
                    
                ))}
            </div>


        </div>
    );
}