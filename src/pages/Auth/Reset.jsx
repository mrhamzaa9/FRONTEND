import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { resetPassword, resetPasswordState } from "../../redux/slice/passwordSlice";

export default function Reset() {
  const { token } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, success, error, message } = useSelector((state) => state.password);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!password || !confirmPassword) return Swal.fire("Error", "Please fill all fields", "error");
    if (password !== confirmPassword) return Swal.fire("Error", "Passwords do not match", "error");
    dispatch(resetPassword({ token, password }));
  };

  useEffect(() => {
    if (success) {
      Swal.fire("Success", message || "Password updated successfully", "success");
      navigate("/login");
    }
    if (error) Swal.fire("Error", error, "error");
    return () => dispatch(resetPasswordState());
  }, [success, error, message, navigate, dispatch]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-amber-700">Reset Password</h2>

        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-amber-400 outline-none transition"
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-amber-400 outline-none transition"
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full p-3 rounded-xl font-semibold text-white shadow-lg transition ${
            loading ? "bg-amber-300 cursor-not-allowed" : "bg-amber-600 hover:bg-amber-700 cursor-pointer"
          }`}
        >
          {loading ? "Updating..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}
