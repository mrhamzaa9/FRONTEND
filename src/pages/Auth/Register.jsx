import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from"../../redux/slice/authSlice";

export default function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    data.role = data.role.toLowerCase();

    const result = await dispatch(registerUser(data));

    if (result.type === "auth/registerUser/rejected") {
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: result.payload || "Failed to register",
      });
      return;
    }

    Swal.fire({
      icon: "success",
      title: "Success!",
      text: "Signup successful!",
      timer: 1500,
      showConfirmButton: false,
    });

    reset();
    setTimeout(() => {
      navigate("/login");
    }, 1500);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Signup</h2>

        {/* Name */}
        <div className="mb-4">
          <input
            placeholder="Name"
            {...register("name", { required: "Name is required" })}
            className="w-full p-3 border border-gray-300 rounded"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="mb-4">
          <input
            placeholder="Email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email format",
              },
            })}
            className="w-full p-3 border border-gray-300 rounded"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="mb-4">
          <input
            type="password"
            placeholder="Password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            className="w-full p-3 border border-gray-300 rounded"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>

        {/* Role */}
        <div className="mb-6">
          <select
            {...register("role", { required: "Role is required" })}
            className="w-full p-3 border border-gray-300 rounded"
          >
            <option value="">Select Role</option>
            <option value="schoolAdmin">School Admin</option>
            <option value="teacher">Teacher</option>
            <option value="student">Student</option>
          </select>
          {errors.role && (
            <p className="text-red-500 text-sm">{errors.role.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full p-2 rounded-2xl text-white ${
            loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading ? "Submitting..." : "SUBMIT"}
        </button>

        <div className="text-center mt-4">
          <Link to="/login" className="text-blue-500">
            Already have an account? Login
          </Link>
        </div>

        {error && <p className="text-red-500 text-center mt-2">{error}</p>}
      </form>
    </div>
  );
}
