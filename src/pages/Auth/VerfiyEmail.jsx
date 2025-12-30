import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { verifyEmail, resetVerifyState } from "../../redux/slice/verifySlice";
import Swal from "sweetalert2";

export default function VerifyEmail() {
  const { token } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, success, error } = useSelector((state) => state.verify);

  useEffect(() => {
    dispatch(verifyEmail(token));
    return () => dispatch(resetVerifyState());
  }, [dispatch, token]);

  useEffect(() => {
    if (success) {
      Swal.fire({ icon: "success", title: "Email Verified", text: "You can now login", timer: 1500, showConfirmButton: false });
      navigate("/login");
    }
    if (error) Swal.fire({ icon: "error", title: "Verification Failed", text: error });
  }, [success, error, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
        {loading && <p className="text-amber-700 text-lg font-semibold">Verifying your email...</p>}
        {!loading && !success && !error && <p className="text-amber-700 text-lg font-semibold">Processing...</p>}
      </div>
    </div>
  );
}
