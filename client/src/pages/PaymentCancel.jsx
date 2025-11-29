import { Link } from "react-router-dom";

const PaymentCancelled = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-2">Payment cancelled</h1>
      <p className="text-gray-600 mb-4">
        Your appointment was not booked. You can try again.
      </p>
      <Link
        to="/doctors"
        className="px-4 py-2 bg-[#FF8040] text-white rounded"
      >
        Back to doctors
      </Link>
    </div>
  </div>
);

export default PaymentCancelled;
