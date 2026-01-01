import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../../redux/slice/schoolSlice"; // your user slice
import Spinner from "../../components/Spinner";
import Swal from "sweetalert2";

export default function ViewUser() {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.school);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);
 console.log(users);
  if (loading === "loading") return <Spinner />;
  if (error) return <p className="text-red-500">{error}</p>;

  const showUserDetails = (user) => {
    Swal.fire({
      title: `<strong>${user.name} (${user.role.toUpperCase()})</strong>`,
      html: `
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Verified:</strong> ${user.isVerified ? "Yes" : "No"}</p>
        <p><strong>Created At:</strong> ${new Date(user.createdAt).toLocaleString()}</p>
        <p><strong>Updated At:</strong> ${new Date(user.updatedAt).toLocaleString()}</p>
   
      `,
      width: "400px",
      confirmButtonText: "Close",
       color: "#D97706",
        background: "#FFFBEB",
        iconColor: "#D97706", 
        confirmButtonColor: "#D97706"

    });
  };

  return (
    <div className="min-h-screen bg-amber-100 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h2 className="text-amber-600 text-3xl sm:text-4xl font-bold">Super Admin Dashboard</h2>
        <p className="text-amber-800 text-lg">Manage all registered users.</p>
      </div>

      {/* User Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <div
            key={user._id}
            onClick={() => showUserDetails(user)}
            className="cursor-pointer bg-white border-2 border-amber-300 shadow-lg rounded-xl p-6 hover:shadow-xl transition transform hover:-translate-y-1 flex flex-col gap-3"
          >
            <h3 className="text-lg font-semibold">Name: {user.name}</h3>
            <p>Role: {user.role}</p>
            <p>Email: {user.email}</p>
            <p>Verified: {user.isVerified ? "Yes" : "No"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
