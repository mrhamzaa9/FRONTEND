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
 console.log(token)
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      return Swal.fire("Error", "Please fill all fields", "error");
    }

    if (password !== confirmPassword) {
      return Swal.fire("Error", "Passwords do not match", "error");
    }

    dispatch(resetPassword({ token, password }));
  };

  useEffect(() => {
    if (success) {
      Swal.fire("Success", message || "Password updated successfully", "success");
      setPassword("");
      setConfirmPassword("");
      navigate("/login"); // redirect to login
    }
    if (error) {
      Swal.fire("Error", error, "error");
    }

    return () => {
      dispatch(resetPasswordState()); // reset slice state on unmount
    };
  }, [success, error, message, dispatch, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>

        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border rounded mb-4"
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full p-3 border rounded mb-4"
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full p-3 rounded-2xl text-white ${
            loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading ? "Updating..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}
