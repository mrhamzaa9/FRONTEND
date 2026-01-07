import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function Paymentsuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (!sessionId) return;

    const checkPayment = async () => {
      try {
        // 1️⃣ Get session info from your backend
        const res = await fetch(`http://localhost:4000/api/enroll/session/${sessionId}`, {
          method: "GET",
          credentials: "include",
        });
        const session = await res.json();

        // 2️⃣ Check if paid
        if (session.payment_status === "paid") {
          // 3️⃣ Enroll student via your API
          await fetch("http://localhost:4000/api/enroll", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ courseId: session.metadata.courseId }),
          });

          Swal.fire("Success", "You are now enrolled!", "success").then(() => {
            navigate("/student"); // redirect to dashboard
          });
        } else {
          Swal.fire("Error", "Payment not completed", "error").then(() => {
            navigate("/student");
          });
        }
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Something went wrong", "error").then(() => {
          navigate("/student");
        });
      }
    };

    checkPayment();
  }, [sessionId, navigate]);

  return <div className="p-6 text-center">Processing payment...</div>;
}
