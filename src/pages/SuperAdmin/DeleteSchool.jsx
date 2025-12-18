import React, { useEffect } from "react";
import { MdOutlineDelete } from "react-icons/md";
import Swal from "sweetalert2";
import Sidebar from "../../components/Siderbar";
import { useDispatch, useSelector } from "react-redux";
import { fetchSchools, deleteSchool } from "../../redux/slice/schoolSlice";
import Spinner from "../../components/Spinner";

export default function DeleteSchool() {
  const dispatch = useDispatch();
  const { schools, loading, error } = useSelector((state) => state.school);

  // Fetch schools on mount
  useEffect(() => {
    dispatch(fetchSchools());
  }, [dispatch]);

  // Delete school handler
  const handleDelete = (id) => {
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
        dispatch(deleteSchool(id))
          .unwrap()
          .then(() => {
            Swal.fire("Deleted!", "The school has been deleted.", "success");
          })
          .catch((err) => {
            Swal.fire("Error!", err, "error");
          });
      }
    });
  };

  if (loading === "loading") {
    return (
      <Spinner />
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
      <p className="text-gray-600 text-lg mb-6">Manage all registered schools.</p>

      {/* School Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {schools.map((school) => (
          <div
            key={school._id}
            className="bg-white shadow-lg rounded-xl p-6 hover:shadow-xl transition transform hover:-translate-y-1"
          >
            <div className="flex flex-col gap-3">
              <h3 className="text-xl font-semibold text-gray-800">SCHOOL NAME: {school.name}</h3>
              <h3 className="text-xl font-semibold text-gray-800">CREATED BY: {school.createdBy?.name}</h3>
              <h3 className="text-xl font-semibold text-gray-800">EMAIL: {school.createdBy?.email}</h3>
            </div>

            <div className="mt-5">
              <button
                onClick={() => handleDelete(school._id)}
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
