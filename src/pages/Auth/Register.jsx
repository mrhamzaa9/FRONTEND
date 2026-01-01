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
        background: "#FFF7ED",
        color: "#7C2D12",
      });
      reset();
      navigate("/login");
    } else {
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: result.payload || "Something went wrong",
        background: "#FFF7ED",
        color: "#7C2D12",
        confirmButtonColor: "#DC2626",
      });

    }
  };

  return (

    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-amber-100"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-amber-700">
          Create Account
        </h2>

        <input
          placeholder="Name"
          {...register("name", { required: "Name is required" })}
          className="w-full p-3 border border-amber-200 rounded-xl mb-2 focus:ring-2 focus:ring-amber-400 outline-none"
        />
        {errors.name && <p className="text-red-500 text-sm mb-2">{errors.name.message}</p>}

        <input
          placeholder="Email"
          {...register("email", { required: "Email is required" })}
          className="w-full p-3 border border-amber-200 rounded-xl mb-2 focus:ring-2 focus:ring-amber-400 outline-none"
        />
        {errors.email && <p className="text-red-500 text-sm mb-2">{errors.email.message}</p>}

        <input
          type="password"
          placeholder="Password"
          {...register("password", { required: "Password is required" })}
          className="w-full p-3 border border-amber-200 rounded-xl mb-2 focus:ring-2 focus:ring-amber-400 outline-none"
        />
        {errors.password && <p className="text-red-500 text-sm mb-2">{errors.password.message}</p>}

        <select
          {...register("role", { required: "Role is required" })}
          className="w-full p-3 border border-amber-200 rounded-xl mb-4 focus:ring-2 focus:ring-amber-400 outline-none"
        >
          <option value="">Select Role</option>
          <option value="schooladmin">School Admin</option>
          <option value="teacher">Teacher</option>
          <option value="student">Student</option>
        </select>

        <button
          type="submit"
          disabled={isSubmitting || loading === "loading"}
          className={`w-full py-3 rounded-xl text-white font-semibold transition shadow-lg ${isSubmitting || loading === "loading"
              ? "bg-amber-300 cursor-not-allowed"
              : "bg-amber-600 hover:bg-amber-700"
            }`}
        >
          {isSubmitting || loading === "loading" ? "Creating Account..." : "Sign Up"}
        </button>

        <p className="text-center mt-4 text-amber-700">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );


}
