// PaymentCancel.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function Paymentcancel() {
  const navigate = useNavigate();

  useEffect(() => {
    Swal.fire("Payment Cancelled", "Your enrollment was not completed.", "warning").then(() => {
      navigate("/student-dashboard");
    });
  }, [navigate]);

  return <div className="p-6">Payment cancelled</div>;
}
