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

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      // Only sending name — backend automatically adds schoolId
      await dispatch(createCourse(data)).unwrap();

      Swal.fire({
        title: "Success!",
        text: "Course created successfully!",
        icon: "success",
        confirmButtonColor: "#3085d6",
      });

      reset();
      setTimeout(() => {
        navigate("/schooladmin");
      }, 700);
    } catch (err) {
      Swal.fire({
        title: "Error!",
        text: err || "Something went wrong!",
        icon: "error",
        confirmButtonColor: "#d33",
      });
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded-xl shadow-md w-full max-w-lg"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
          Create Course
        </h2>

        <div className="mb-5">
          <label className="block mb-1 font-medium">Course Name</label>
          <input
            type="text"
            {...register("name", { required: "Course name is required" })}
            className="w-full p-3 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="Enter course name"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || loading === "loading"}
          className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
        >
          {loading === "loading" ? "Submitting..." : "Create Course"}
        </button>
      </form>
    </div>
  );
}