import React, { useEffect } from "react";
import { MdOutlineDelete } from "react-icons/md";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, deleteUser } from "../../redux/slice/schoolSlice";
import Spinner from "../../components/Spinner";

export default function DeleteUser() {
  const dispatch = useDispatch();
  const { users = [], loading, error } = useSelector((state) => state.school);

  useEffect(() => { dispatch(fetchUsers()); }, [dispatch]);

  const handleDelete = (userId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d97706",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteUser(userId))
          .unwrap()
          .then(() => Swal.fire("Deleted!", "The user has been deleted.", "success"))
          .catch((err) => Swal.fire("Error!", err || "Failed to delete user", "error"));
      }
    });
  };

  if (loading === "loading") return <Spinner />;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-amber-50 p-6">
      <h2 className="text-amber-700 text-4xl font-bold mb-4">Super Admin Dashboard</h2>
      <p className="text-amber-800 text-lg mb-6">Manage all registered users.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.length === 0 ? (
          <p className="text-gray-500 col-span-full">No users found.</p>
        ) : (
          users.map((u) => (
            <div
              key={u._id}
              className="bg-white border-2 border-amber-300 shadow-lg rounded-xl p-6 hover:shadow-xl transition transform hover:-translate-y-1"
            >
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-semibold text-gray-800">NAME: {u.name}</h3>
                <p className="text-gray-700">ROLE: {u.role}</p>
                <p className="text-gray-700">EMAIL: {u.email}</p>
              </div>

              <div className="mt-5">
                <button
                  onClick={() => handleDelete(u._id)}
                  className="text-amber-600 hover:text-amber-800 p-2 rounded transition"
                >
                  <MdOutlineDelete size={24} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
