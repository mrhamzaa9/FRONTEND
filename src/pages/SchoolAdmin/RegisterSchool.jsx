import React from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../context/auth";
import Swal from "sweetalert2";
import { Link, useNavigate,  } from "react-router-dom";

export default function RegisterSchool() {
  const navigate = useNavigate()
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      createdBy: user?._id || "",
    },
  });

  const onSubmit = async (data) => {
    try {
      data.createdBy = user?._id;

      const res = await fetch("http://localhost:4000/api/school/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      const result = await res.json();
        
        if (!res.ok) {
      Swal.fire({
        title: "Server Error!",
        text: result.message ,
        icon: "error",
        confirmButtonColor: "#d33",
      });
      return; 
    }
      // SUCCESS POPUP
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
      console.log(err);

      // ERROR POPUP
      Swal.fire({
        title: "Error!",
        text: "Something went wrong while creating the school.",
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
        <Link to="/schooladmin" className="text-blue-500">
          Back home
        </Link>
      </form>
    </div>
  );
}
