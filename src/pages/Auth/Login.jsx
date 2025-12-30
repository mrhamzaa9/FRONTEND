import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../redux/slice/authSlice";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
        text: result.payload || "Invalid credentials",
      });
    }
  };

  return (
   <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-4">
  <form
    onSubmit={handleSubmit(onSubmit)}
    className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md"
  >
    <h2 className="text-3xl font-bold mb-6 text-center text-amber-700">Login</h2>

    {/* Email */}
    <div className="mb-4">
      <input
        type="email"
        placeholder="Email"
        {...register("email", { required: "Email is required" })}
        className="w-full p-3 border border-gray-300 rounded-lg mb-1 focus:ring-2 focus:ring-amber-400 outline-none transition"
      />
      {errors.email && (
        <p className="text-red-600 text-sm">{errors.email.message}</p>
      )}
    </div>

    {/* Password */}
    <div className="mb-6">
      <input
        type="password"
        placeholder="Password"
        {...register("password", { required: "Password is required" })}
        className="w-full p-3 border border-gray-300 rounded-lg mb-1 focus:ring-2 focus:ring-amber-400 outline-none transition"
      />
      {errors.password && (
        <p className="text-red-600 text-sm">{errors.password.message}</p>
      )}
    </div>

    {/* Submit Button */}
    <button
      type="submit"
      disabled={loading === "loading"}
      className={`w-full p-3 rounded-xl font-semibold text-white shadow-lg transition ${
        loading === "loading"
          ? "bg-amber-300 cursor-not-allowed"
          : "bg-amber-600 hover:bg-amber-700 cursor-pointer"
      }`}
    >
      {loading === "loading" ? "Logging in..." : "Login"}
    </button>

    {/* Links */}
    <p className="text-center mt-4 text-amber-700">
      Don’t have an account?{" "}
      <Link to="/sign" className="font-medium hover:underline">
        Sign Up
      </Link>
    </p>
    <p className="text-center mt-2 text-amber-700">
      <Link to="/forgot-password" className="hover:underline">
        Forgot Password?
      </Link>
    </p>
  </form>
</div>

  );
}
