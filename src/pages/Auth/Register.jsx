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
   <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-4">
  <form className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
    <h2 className="text-3xl font-bold mb-6 text-center text-amber-700">Create Account</h2>

    <input className="w-full p-3 border border-gray-300 rounded-lg mb-3 focus:ring-2 focus:ring-amber-400 outline-none transition" placeholder="Name" />
    <input className="w-full p-3 border border-gray-300 rounded-lg mb-3 focus:ring-2 focus:ring-amber-400 outline-none transition" placeholder="Email" />
    <input type="password" className="w-full p-3 border border-gray-300 rounded-lg mb-3 focus:ring-2 focus:ring-amber-400 outline-none transition" placeholder="Password" />
    <select className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-amber-400 outline-none transition">
      <option value="">Select Role</option>
      <option value="schooladmin">School Admin</option>
      <option value="teacher">Teacher</option>
      <option value="student">Student</option>
    </select>

    <button className="w-full p-3 rounded-xl text-white font-semibold transition shadow-lg bg-amber-600 hover:bg-amber-700 cursor-pointer">
      Sign Up
    </button>

    <p className="text-center mt-4 text-amber-700">
      Already have an account? <Link to="/login" className="hover:underline">Login</Link>
    </p>
  </form>
</div>

  );
}
