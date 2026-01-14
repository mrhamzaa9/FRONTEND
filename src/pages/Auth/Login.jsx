import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";

import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../redux/slice/authSlice";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const { loading } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    const result = await dispatch(loginUser(data));

    if (loginUser.fulfilled.match(result)) {
      const user = result.payload;
      reset();

      Swal.fire({
        icon: "success",
        title: "Login Successful",
        color: "#D97706",
        background: "#FFFBEB",
        iconColor: "#D97706", 
        text: `Welcome ${user.role}!`,
        timer: 1200,
        showConfirmButton: false,
      });


      setTimeout(() => {
        if (user.role === "schooladmin") navigate("/schooladmin");
        if (user.role === "superadmin") navigate("/superadmin");
        if (user.role === "teacher") navigate("/teacher");
        if (user.role === "student") navigate("/student");
      }, 2000);
    } else {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: errors.message || "Invalid credentials",
      });
    }
  };

  return (
<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-100 via-orange-50 to-amber-200 px-4">
  <div className="w-full max-w-md">
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white/90 backdrop-blur-lg border border-white/30 p-8 sm:p-10 rounded-3xl shadow-2xl"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-extrabold text-amber-700">
          Welcome Back
        </h2>
        <p className="text-gray-500 mt-2">
          Login to continue your learning journey
        </p>
      </div>

      {/* Email */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Email Address
        </label>
        <div className="relative">
          <EmailIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-600" />
          <input
            type="email"
            placeholder="you@example.com"
            {...register("email", { required: "Email is required" })}
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-400 outline-none transition"
          />
        </div>
        {errors.email && (
          <p className="text-red-600 text-sm mt-1">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Password
        </label>
        <div className="relative">
          <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-600" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            {...register("password", { required: "Password is required" })}
            className="w-full pl-11 pr-12 py-3 rounded-xl border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-400 outline-none transition"
          />
          <IconButton
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            className="!absolute right-2 top-1/2 -translate-y-1/2 text-amber-600"
          >
            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
          </IconButton>
        </div>
        {errors.password && (
          <p className="text-red-600 text-sm mt-1">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading === "loading"}
        className={`w-full py-3 rounded-xl font-semibold text-white text-lg shadow-lg transition-all duration-300 ${
          loading === "loading"
            ? "bg-amber-300 cursor-not-allowed"
            : "bg-amber-600 hover:bg-amber-700 hover:shadow-xl active:scale-[0.98]"
        }`}
      >
        {loading === "loading" ? "Logging in..." : "Login"}
      </button>

      {/* Footer */}
      <div className="text-center mt-6 space-y-2">
        <p className="text-gray-600">
          Don’t have an account?{" "}
          <Link
            to="/sign"
            className="text-amber-700 font-semibold hover:underline"
          >
            Sign Up
          </Link>
        </p>

        <Link
          to="/forgot-password"
          className="block text-sm text-amber-700 hover:underline"
        >
          Forgot Password?
        </Link>
      </div>
    </form>
  </div>
</div>


  );
}
