import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../redux/slice/authSlice.js"

export default function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    data.role = data.role.toLowerCase();

    const result = await dispatch(registerUser(data));

    if (registerUser.fulfilled.match(result)) {
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Signup successful!",
        timer: 1500,
        showConfirmButton: false,
      });
      reset();
      navigate("/login");
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: result.payload || "Failed to register",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Signup</h2>

        <input
          placeholder="Name"
          {...register("name", { required: "Name is required" })}
          className="w-full p-3 border rounded mb-4"
        />
        {errors.name && <p className="text-red-500 text-sm mb-2">{errors.name.message}</p>}

        <input
          placeholder="Email"
          {...register("email", { required: "Email is required" })}
          className="w-full p-3 border rounded mb-4"
        />
        {errors.email && <p className="text-red-500 text-sm mb-2">{errors.email.message}</p>}

        <input
          type="password"
          placeholder="Password"
          {...register("password", { required: "Password is required" })}
          className="w-full p-3 border rounded mb-4"
        />
        {errors.password && <p className="text-red-500 text-sm mb-2">{errors.password.message}</p>}

        <select
          {...register("role", { required: "Role is required" })}
          className="w-full p-3 border rounded mb-4"
        >
          <option value="">Select Role</option>
          <option value="schooladmin">School Admin</option>
          <option value="teacher">Teacher</option>
          <option value="student">Student</option>
        </select>
        {errors.role && <p className="text-red-500 text-sm mb-2">{errors.role.message}</p>}

        <button
          type="submit"
          disabled={isSubmitting || loading === "loading"}
          className={`w-full p-2 rounded-2xl text-white ${
            isSubmitting || loading === "loading"
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {isSubmitting || loading === "loading" ? "Submitting..." : "SUBMIT"}
        </button>

        {error && <p className="text-red-500 text-center mt-2">{error}</p>}

        <div className="text-center mt-4">
          <Link to="/login" className="text-blue-500 hover:underline">
            Already have an account? Login
          </Link>
        </div>
      </form>
    </div>
  );
}
