import React, { useEffect, useState } from "react";
import api from "../../api/axios";

const PatientBilling = () => {
  const [payments, setPayments] = useState([]);
  const [summary, setSummary] = useState({ totalPaid: 0, totalCount: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBilling = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          window.location.href = "/login/patient";
          return;
        }

        const res = await api.get("/appointments/my");
        const appts = res.data || [];

        // consider "confirmed" as paid; adjust if you store paymentStatus
        const paidAppts = appts.filter(
          (a) =>
            a.status === "confirmed" ||
            a.paymentStatus === "paid" ||
            a.paymentStatus === "succeeded"
        );

        const totalPaid = paidAppts.reduce(
          (sum, a) => sum + (a.fee || a.amount || 0),
          0
        );

        setPayments(paidAppts);
        setSummary({
          totalPaid,
          totalCount: paidAppts.length,
        });
      } catch (err) {
        console.error("PATIENT BILLING ERROR:", err);
        setError(
          err?.response?.data?.message || err.message || "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBilling();
  }, []);

  if (loading) {
    return <p className="text-gray-500 px-4 py-4">Loading billing...</p>;
  }

  if (error) {
    return (
      <div className="text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2 inline-block m-4">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-2">Billing & Payments</h1>
      <p className="text-sm text-gray-500 mb-6">
        View your appointment payment history.
      </p>

      {/* SUMMARY CARDS */}
      <div className="grid gap-4 mb-6 sm:grid-cols-2">
        <SummaryCard
          label="Total paid"
          value={`₹${summary.totalPaid}`}
        />
        <SummaryCard
          label="Paid appointments"
          value={summary.totalCount}
        />
      </div>

      {/* PAYMENT TABLE */}
      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="text-lg font-medium mb-3">Payment history</h2>

        {payments.length === 0 ? (
          <p className="text-sm text-gray-500">
            No paid appointments yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead className="text-left text-gray-500 border-b">
                <tr>
                  <th className="py-2 pr-4">Doctor</th>
                  <th className="py-2 pr-4">Date & time</th>
                  <th className="py-2 pr-4">Amount</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2 pr-4">Payment ID</th>
                  <th className="py-2 pr-4">Paid at</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((appt) => {
                  const amount = appt.fee || appt.amount || 0;
                  const paymentId =
                    appt.paymentIntentId ||
                    appt.stripePaymentIntentId ||
                    appt.transactionId ||
                    "-";
                  const paidAt = appt.paidAt || appt.createdAt;

                  return (
                    <tr
                      key={appt._id}
                      className="border-b last:border-b-0 hover:bg-gray-50"
                    >
                      <td className="py-2 pr-4">
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {appt.doctor?.name || "Unknown doctor"}
                          </span>
                          {appt.doctor?.specialization && (
                            <span className="text-xs text-gray-500">
                              {appt.doctor.specialization}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-2 pr-4">
                        {appt.date} {appt.time && `at ${appt.time}`}
                      </td>
                      <td className="py-2 pr-4 font-semibold">
                        ₹{amount}
                      </td>
                      <td className="py-2 pr-4">
                        <span className="inline-flex px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-700">
                          {appt.paymentStatus
                            ? appt.paymentStatus
                            : appt.status}
                        </span>
                      </td>
                      <td className="py-2 pr-4 text-xs text-gray-600">
                        {paymentId}
                      </td>
                      <td className="py-2 pr-4 text-xs text-gray-600">
                        {paidAt
                          ? new Date(paidAt).toLocaleString()
                          : "-"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const SummaryCard = ({ label, value }) => (
  <div className="bg-white rounded-xl shadow p-4">
    <p className="text-xs text-gray-500 mb-1">{label}</p>
    <p className="text-2xl font-semibold text-gray-800">{value}</p>
  </div>
);

export default PatientBilling;
