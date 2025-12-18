import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { createSchool } from "../../redux/slice/schoolSlice"; // your slice

export default function RegisterSchool() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth); // get logged-in user
  const { isSubmitting } = useSelector((state) => state.school); // optional loading state

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      createdBy: user?._id || "",
    },
  });

  const onSubmit = async (data) => {
    try {
      data.createdBy = user?._id;

      await dispatch(createSchool(data)).unwrap();

      Swal.fire({
        title: "Success!",
        text: "School created successfully!",
        icon: "success",
        confirmButtonColor: "#3085d6",
      });

      reset();

      setTimeout(() => {
        navigate("/schooladmin");
      }, 1500);
    } catch (err) {
      Swal.fire({
        title: "Error!",
        text: err || "Something went wrong while creating the school.",
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
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">
          Create School
        </h2>

        {/* NAME INPUT */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">School Name</label>
          <input
            type="text"
            {...register("name", { required: "Name is required" })}
            className="w-full p-3 border rounded-md"
            placeholder="Enter school name"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        {/* ADDRESS INPUT */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Address</label>
          <input
            type="text"
            {...register("address", { required: "Address is required" })}
            className="w-full p-3 border rounded-md"
            placeholder="Enter address"
          />
          {errors.address && (
            <p className="text-red-500 text-sm">{errors.address.message}</p>
          )}
        </div>

        {/* CREATED BY (hidden) */}
        <input type="hidden" {...register("createdBy")} />

        {/* SUBMIT BTN */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600"
          disabled={isSubmitting}
        >
          Submit
        </button>
      </form>
    </div>
  );
}
