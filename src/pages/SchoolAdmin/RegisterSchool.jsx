import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { createSchool } from "../../redux/slice/schoolSlice";

export default function RegisterSchool() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { isSubmitting } = useSelector((state) => state.school);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: { createdBy: user?._id || "" },
  });

  const onSubmit = async (data) => {
    try {
      data.createdBy = user?._id;
      await dispatch(createSchool(data)).unwrap();
      Swal.fire({ title: "Success!", text: "School created successfully!", icon: "success", confirmButtonColor: "#6B4226" });
      reset();
      setTimeout(() => navigate("/schooladmin"), 1500);
    } catch (err) {
      Swal.fire({ title: "Error!", text: err || "Something went wrong.", icon: "error", confirmButtonColor: "#6B4226" });
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-amber-50 to-orange-50 p-4">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg">
        <h2 className="text-3xl font-bold mb-6 text-center text-amber-700">Create School</h2>

        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-700">School Name</label>
          <input
            type="text"
            {...register("name", { required: "Name is required" })}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-amber-400 outline-none transition"
            placeholder="Enter school name"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-700">Address</label>
          <input
            type="text"
            {...register("address", { required: "Address is required" })}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-amber-400 outline-none transition"
            placeholder="Enter address"
          />
          {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
        </div>

        <input type="hidden" {...register("createdBy")} />

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full p-3 rounded-xl font-semibold text-white shadow-lg transition ${
            isSubmitting ? "bg-amber-300 cursor-not-allowed" : "bg-amber-600 hover:bg-amber-700 cursor-pointer"
          }`}
        >
          Submit
        </button>
      </form>
    </div>
  );
}
