import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../api/axios";

const PaymentSuccess = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const sessionId = params.get("session_id");
    if (!sessionId) return;

    api
      .post("/appointments/confirm", { sessionId })
      .then(() => {
        // after confirm, go to patient appointments
        navigate("/dashboard/patient/appointments");
      })
      .catch((err) => {
        console.error("Payment confirm error", err);
      });
  }, [params, navigate]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">
          Payment successful! 🎉
        </h1>
        <p className="text-gray-600">
          We’re confirming your appointment. You’ll be redirected shortly.
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccess;
