import React, { useState } from "react";

import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../redux/slice/authSlice";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import SchoolIcon from "@mui/icons-material/School";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BadgeIcon from "@mui/icons-material/Badge";


export default function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
 const [showPassword, setShowPassword] = useState(false); 
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  const role = watch("role"); // watch role selection for conditional fields

  const onSubmit = async (data) => {
    // Normalize role
    data.role = data.role.toLowerCase();

    // Prepare payload
    const payload = {
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
    };

    // Include school info only if School Admin
    if (data.role === "schooladmin") {
      payload.school = {
        name: data.schoolName,
        address: data.schoolAddress,
      };
    }

    try {
      const result = await dispatch(registerUser(payload));

      if (registerUser.fulfilled.match(result)) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Signup successful! Please verify your email.",
          timer: 1800,
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
          text: err.message || "Something went wrong",
          background: "#FFF7ED",
          color: "#7C2D12",
          confirmButtonColor: "#DC2626",
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message || "Something went wrong",
        background: "#FFF7ED",
        color: "#7C2D12",
        confirmButtonColor: "#DC2626",
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
          Create Account
        </h2>
        <p className="text-gray-500 mt-2">
          Join and start your learning journey
        </p>
      </div>

      {/* Name */}
      <div className="mb-4">
        <div className="relative">
          <PersonIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-600" />
          <input
            placeholder="Full Name"
            {...register("name", { required: "Name is required" })}
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-400 focus:border-amber-500 outline-none"
          />
        </div>
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      {/* Email */}
      <div className="mb-4">
        <div className="relative">
          <EmailIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-600" />
          <input
            placeholder="Email (Gmail only)"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
                message: "Enter a valid Gmail address",
              },
            })}
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-400 focus:border-amber-500 outline-none"
          />
        </div>
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
   <div className="mb-4">
  <div className="relative">
    <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-600" />

    <input
      type={showPassword ? "text" : "password"}
      placeholder="Password"
      {...register("password", { required: "Password is required" })}
      className="w-full pl-11 pr-12 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-400 focus:border-amber-500 outline-none"
    />

    <IconButton
      type="button"
      onClick={() => setShowPassword((prev) => !prev)}
      className="!absolute right-2 top-1/2 -translate-y-1/2 text-amber-600"
    >
      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
    </IconButton>
  </div>

  {errors.password && (
    <p className="text-red-500 text-sm mt-1">
      {errors.password.message}
    </p>
  )}
</div>

      {/* Role */}
      <div className="mb-5">
        <div className="relative">
          <BadgeIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-600" />
          <select
            {...register("role", { required: "Role is required" })}
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-amber-400 focus:border-amber-500 outline-none"
          >
            <option value="">Select Role</option>
            <option value="schooladmin">School Admin</option>
            <option value="teacher">Teacher</option>
            <option value="student">Student</option>
          </select>
        </div>
        {errors.role && (
          <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
        )}
      </div>

      {/* School Admin Fields */}
      {role === "schooladmin" && (
        <>
          <div className="mb-4">
            <div className="relative">
              <SchoolIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-600" />
              <input
                placeholder="School Name"
                {...register("schoolName", {
                  required: "School Name is required",
                })}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-400 focus:border-amber-500 outline-none"
              />
            </div>
            {errors.schoolName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.schoolName.message}
              </p>
            )}
          </div>

          <div className="mb-4">
            <div className="relative">
              <LocationOnIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-600" />
              <input
                placeholder="School Address"
                {...register("schoolAddress", {
                  required: "School Address is required",
                })}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-400 focus:border-amber-500 outline-none"
              />
            </div>
            {errors.schoolAddress && (
              <p className="text-red-500 text-sm mt-1">
                {errors.schoolAddress.message}
              </p>
            )}
          </div>
        </>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting || loading === "loading"}
        className={`w-full py-3 rounded-xl text-white font-semibold text-lg shadow-lg transition-all ${
          isSubmitting || loading === "loading"
            ? "bg-amber-300 cursor-not-allowed"
            : "bg-amber-600 hover:bg-amber-700 hover:shadow-xl active:scale-[0.98]"
        }`}
      >
        {isSubmitting || loading === "loading"
          ? "Creating Account..."
          : "Sign Up"}
      </button>

      {/* Footer */}
      <p className="text-center mt-6 text-gray-600">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-amber-700 font-semibold hover:underline"
        >
          Login
        </Link>
      </p>
    </form>
  </div>
</div>

  );
}
