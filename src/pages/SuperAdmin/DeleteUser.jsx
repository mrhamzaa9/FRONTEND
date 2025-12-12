import React, { useEffect } from "react";
import { MdOutlineDelete } from "react-icons/md";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, deleteUser } from "../../redux/slice/schoolSlice";
import Spinner from "../../components/Spinner";

export default function DeleteUser() {
  const dispatch = useDispatch();
  const { users = [], loading, error } = useSelector((state) => state.school);

  // Fetch users on mount
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  // Delete user handler
  const handleDelete = (userId) => {
    console.log("Deleting ID:", userId); 
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteUser(userId))
          .unwrap()
          .then(() => {
            Swal.fire("Deleted!", "The user has been deleted.", "success");
          })
          .catch((err) => {
            Swal.fire("Error!", err || "Failed to delete user", "error");
          });
      }
    });
  };

  if (loading === "loading") return <Spinner />;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-blue-600 text-4xl font-bold">Super Admin Dashboard</h2>
      </div>

      <p className="text-gray-600 text-lg mb-6">Manage all registered users.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.length === 0 ? (
          <p className="text-gray-500 col-span-full">No users found.</p>
        ) : (
          users.map((u) => {
            // Check if u is an object or string
            const userId = typeof u === "object" ? u._id : u;
            const userName = typeof u === "object" ? u.name : u;
            const userRole = typeof u === "object" ? u.role : "-";
            const userEmail = typeof u === "object" ? u.email : "-";

            return (
              <div
                key={userId}
                className="bg-white shadow-lg rounded-xl p-6 hover:shadow-xl transition transform hover:-translate-y-1"
              >
                <div className="flex flex-col gap-2">
                  <h3 className="text-xl font-semibold text-gray-800">Name: {userName}</h3>
                  <p className="text-gray-700">Role: {userRole}</p>
                  <p className="text-gray-700">Email: {userEmail}</p>
                </div>

                <div className="mt-5">
                  <button
                    onClick={() => handleDelete(userId)}
                    className="text-red-500 hover:text-red-700 p-1 rounded transition"
                  >
                    <MdOutlineDelete size={24} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
