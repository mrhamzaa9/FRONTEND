import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { createCourse } from "../../redux/slice/courseSlice";

export default function CreateCourse() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.course);

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm();

  const onSubmit = async (data) => {
    try {
      await dispatch(createCourse(data)).unwrap();

      Swal.fire({
        title: "Success!",
        text: "Course created successfully!",
        icon: "success",
        confirmButtonColor: "#6B4226",
        color: "#D97706",
        background: "#FFFBEB",
        iconColor: "#D97706", 
      });

      reset();
      setTimeout(() => navigate("/schooladmin"), 700);
    } catch (err) {
      Swal.fire({
        title: "Error!",
        text: err || "Something went wrong!",
        icon: "error",
        confirmButtonColor: "#6B4226",
      });
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-amber-50 to-orange-50 p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-amber-700">
          Create Course
        </h2>

        <div className="mb-5">
          <label className="block mb-1 font-medium text-gray-700">Course Name</label>
          <input
            type="text"
            {...register("name", { required: "Course name is required" })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
            placeholder="Enter course name"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || loading === "loading"}
          className={`w-full p-3 rounded-xl font-semibold text-white shadow-lg transition ${
            isSubmitting || loading === "loading"
              ? "bg-amber-300 cursor-not-allowed"
              : "bg-amber-600 hover:bg-amber-700 cursor-pointer"
          }`}
        >
          {loading === "loading" ? "Submitting..." : "Create Course"}
        </button>
      </form>
    </div>
  );
}
