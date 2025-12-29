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
      setEmail(""); // clear input
    }
    if (error) {
      Swal.fire("Error", error, "error");
    }

    return () => {
      dispatch(resetPasswordState()); // clean state when unmount
    };
  }, [success, error, message, dispatch]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Forgot Password</h2>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border rounded mb-4"
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full p-3 rounded-2xl text-white ${
            loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
        
        <p className="text-center mt-4">
          <Link to="/login" className="text-blue-500 hover:underline">
            Back to Login
          </Link>
        </p>

      </form>
    </div>
  );
}
