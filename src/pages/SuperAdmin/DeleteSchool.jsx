
import React, { useEffect, useState } from "react";
import { data, useNavigate } from "react-router-dom";
import { MdOutlineDelete } from "react-icons/md";
import Swal from "sweetalert2";
import { useAuth } from "../../context/auth";
import Sidebar from "../../components/Siderbar";

export default function DeleteSchool() {
    const [users, setUsers] = useState([]);
    

    useEffect(() => {
        fetch(`http://localhost:4000/api/superadmin/`, { credentials: "include", method: "GET" })
            .then((res) => res.json())
            .then((data) => setUsers(data));
    }, []);
      console.log("Users:", users);
 
    const deleteUser = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await fetch(`http://localhost:4000/api/superadmin/delete/${id}`, {
                        method: "DELETE",
                    });
                    
                    if (!res.ok) throw new Error("Delete failed");
                    credentials: "include",

                    // update UI
                    setUsers((prev) => prev.filter((u) => u._id !== id));

                    Swal.fire("Deleted!", "The user has been deleted.", "success");
                } catch (error) {
                    Swal.fire("Error!", error.message, "error");
                }
            }
        });
    }; <button
        onClick={() => deleteUser(u._id)}
        className="text-red-500 hover:text-red-700 p-1 rounded transition"
    >
        <MdOutlineDelete size={24} />
    </button>



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
                {users.map((u) => (
                    <div
                        key={u._id}
                        className="bg-white shadow-lg rounded-xl p-6 hover:shadow-xl transition transform hover:-translate-y-1"
                    >
                        <div className="flex flex-col gap-3">
                            <h3 className="text-xl font-semibold text-gray-800"> SCHOOL NAME:{u.name}</h3>
                             <h3 className="text-xl font-semibold text-gray-800"> CREATEDBY :{u.createdBy?.name}</h3>
                               <h3 className="text-xl font-semibold text-gray-800">EMIAL: {u.createdBy?.email}</h3>
                               
                        </div>
                       
                                        
                        <div className="mt-5">
                            <button
                                onClick={() => deleteUser(u._id)}
                                className="text-red-500 hover:text-red-700 p-1 rounded transition"
                            >
                                <MdOutlineDelete size={24} />
                            </button>

                        </div>
                    </div>
                ))}
            </div>


        </div>
    );
}