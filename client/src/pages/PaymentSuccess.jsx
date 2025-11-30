import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../api/axios";
import { confirmCreditsPurchase } from "../api/billingApi";

const PaymentSuccess = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const sessionId = params.get("session_id");
    const type = params.get("type") || "appointment";

    // Appointment flow
    if (type === "appointment") {
      if (!sessionId) return;

      api
        .post("/appointments/confirm", { sessionId })
        .then(() => {
          navigate("/dashboard/patient/appointments");
        })
        .catch((err) => {
          console.error("Payment confirm error", err);
        });

      return;
    }

    // Credits flow
    if (type === "credits") {
      if (!sessionId) return;

      confirmCreditsPurchase(sessionId)
        .then(() => {
          navigate("/patient/billing"); // go to Billing page after purchase
        })
        .catch((err) => {
          console.error("Confirm credits error", err);
        });

      return;
    }
  }, [params, navigate]);

  const type = params.get("type") || "appointment";
  const isCredits = type === "credits";

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Payment successful! 🎉</h1>
        <p className="text-gray-600">
          {isCredits
            ? "Your credits are being added and the transaction is being recorded..."
            : "We’re confirming your appointment. You’ll be redirected shortly."}
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccess;
