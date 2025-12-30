import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { forgotPassword, resetPasswordState } from "../../redux/slice/passwordSlice";
import { Link } from "react-router-dom";

export default function Forgetpass() {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const { loading, success, error, message } = useSelector((state) => state.password);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return Swal.fire("Error", "Please enter your email", "error");
    dispatch(forgotPassword(email));
  };

  useEffect(() => {
    if (success) {
      Swal.fire("Success", message || "Reset link sent to your email", "success");
      setEmail("");
    }
    if (error) Swal.fire("Error", error, "error");
    return () => dispatch(resetPasswordState());
  }, [success, error, message, dispatch]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-amber-700">Forgot Password</h2>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-amber-400 outline-none transition"
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full p-3 rounded-xl font-semibold text-white shadow-lg transition ${
            loading ? "bg-amber-300 cursor-not-allowed" : "bg-amber-600 hover:bg-amber-700 cursor-pointer"
          }`}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        <p className="text-center mt-4 text-amber-700">
          <Link to="/login" className="hover:underline font-medium">Back to Login</Link>
        </p>
      </form>
    </div>
  );
}
