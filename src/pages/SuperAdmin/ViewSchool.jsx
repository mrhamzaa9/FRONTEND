import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSchools } from "../../redux/slice/schoolSlice";
import Spinner from "../../components/Spinner";
import Swal from "sweetalert2";

export default function ViewSchool() {
  const dispatch = useDispatch();
  const { schools, loading, error } = useSelector((state) => state.school);

  useEffect(() => {
    dispatch(fetchSchools());
  }, [dispatch]);

  if (loading === "loading") return <Spinner />;
  if (error) return <p className="text-red-500">{error}</p>;

  const showSchoolPopup = (school) => {
    Swal.fire({
      title: `<strong>${school.name}</strong>`,
      html: `
        <p><strong>Created By:</strong> ${school.createdBy?.name || "-"}</p>
        <p><strong>Email:</strong> ${school.createdBy?.email || "-"}</p>
        <p><strong>Created At:</strong> ${new Date(school.createdAt).toLocaleDateString()}</p>
        <p><strong>Number of Students:</strong> ${school.students?.length || 0}</p>
        <p><strong>Number of Teachers:</strong> ${school.teachers?.length || 0}</p>
      `,
      width: "500px",
      confirmButtonText: "Close",
       color: "#D97706",
        background: "#FFFBEB",
        iconColor: "#D97706", 
        confirmButtonColor: "#6B4226"
    });
  };

  return (
    <div className="min-h-screen bg-amber-100 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h2 className="text-amber-600 text-3xl sm:text-4xl font-bold">Super Admin Dashboard</h2>
        <p className="text-amber-800 text-lg">Manage all registered schools.</p>
      </div>

      {/* School Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {schools.map((school) => (
          <div
            key={school._id}
            onClick={() => showSchoolPopup(school)}
            className="cursor-pointer bg-white border-2 border-amber-300 shadow-lg rounded-xl p-6 hover:shadow-xl transition transform hover:-translate-y-1 flex flex-col gap-3"
          >
            <h3 className="text-lg font-semibold">School Name: {school.name}</h3>
            <p>Created By: {school.createdBy?.name || "-"}</p>
            <p>Email: {school.createdBy?.email || "-"}</p>
            <p>Created At: {new Date(school.createdAt).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
