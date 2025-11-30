// client/src/pages/Patient/PatientBilling.jsx
import React, { useEffect, useState } from "react";
import api from "../../api/axios";

const PLAN_NAMES = {
  basic: "Basic plan",
  pro: "Pro plan",
  premium: "Premium plan",
};

const PatientBilling = () => {
  const [payments, setPayments] = useState([]); // appointment payments
  const [summary, setSummary] = useState({ totalPaid: 0, totalCount: 0 });

  const [creditTxs, setCreditTxs] = useState([]); // plan/credits transactions
  const [creditSummary, setCreditSummary] = useState({
    totalCredits: 0,
    totalAmount: 0,
  });

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

        const [apptRes, txRes] = await Promise.all([
          api.get("/appointments/my"),
          api.get("/billing/my-transactions"),
        ]);

        const appts = apptRes.data || [];
        const txs = txRes.data || [];

        // --- APPOINTMENT PAYMENTS ---
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

        // --- CREDIT (PLAN) TRANSACTIONS ---
        const totalCredits = txs.reduce(
          (sum, t) => sum + (t.credits || 0),
          0
        );
        const totalAmountMinor = txs.reduce(
          (sum, t) => sum + (t.amount || 0),
          0
        );

        setCreditTxs(txs);
        setCreditSummary({
          totalCredits,
          totalAmount: totalAmountMinor,
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

  const formatStripeAmount = (amountMinor, currency = "inr") => {
    const major = (amountMinor || 0) / 100; // paise -> ₹
    const upper = currency?.toUpperCase?.() || "INR";
    if (upper === "INR") return `₹${major.toFixed(2)}`;
    return `${upper} ${major.toFixed(2)}`;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-2">Billing & Payments</h1>
        <p className="text-sm text-gray-500 mb-6">
          View your appointment payment history and credit (plan) purchases.
        </p>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid gap-4 mb-2 sm:grid-cols-3">
        <SummaryCard
          label="Total paid for appointments"
          value={`₹${summary.totalPaid}`}
        />
        <SummaryCard label="Paid appointments" value={summary.totalCount} />
        <SummaryCard
          label="Total credits purchased"
          value={`${creditSummary.totalCredits} credits (${formatStripeAmount(
            creditSummary.totalAmount
          )})`}
        />
      </div>

      {/* APPOINTMENT PAYMENT TABLE */}
      <div className="bg-white rounded-xl shadow p-4 space-y-3">
        <h2 className="text-lg font-medium">Appointment payments</h2>

        {payments.length === 0 ? (
          <p className="text-sm text-gray-500">No paid appointments yet.</p>
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
                      <td className="py-2 pr-4 font-semibold">₹{amount}</td>
                      <td className="py-2 pr-4">
                        <span className="inline-flex px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-700">
                          {appt.paymentStatus ? appt.paymentStatus : appt.status}
                        </span>
                      </td>
                      <td className="py-2 pr-4 text-xs text-gray-600">
                        {paymentId}
                      </td>
                      <td className="py-2 pr-4 text-xs text-gray-600">
                        {paidAt ? new Date(paidAt).toLocaleString() : "-"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREDIT / PLAN PURCHASE TABLE */}
      <div className="bg-white rounded-xl shadow p-4 space-y-3">
        <h2 className="text-lg font-medium">Credit purchases (plans)</h2>

        {creditTxs.length === 0 ? (
          <p className="text-sm text-gray-500">
            No credit purchases yet. You can buy credits from the{" "}
            <a href="/plans" className="text-blue-600 underline">
              Plans
            </a>{" "}
            page.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead className="text-left text-gray-500 border-b">
                <tr>
                  <th className="py-2 pr-4">Date</th>
                  <th className="py-2 pr-4">Plan</th>
                  <th className="py-2 pr-4">Credits</th>
                  <th className="py-2 pr-4">Amount</th>
                  <th className="py-2 pr-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {creditTxs.map((tx) => (
                  <tr
                    key={tx._id}
                    className="border-b last:border-b-0 hover:bg-gray-50"
                  >
                    <td className="py-2 pr-4 text-xs text-gray-600">
                      {tx.createdAt
                        ? new Date(tx.createdAt).toLocaleString()
                        : "-"}
                    </td>
                    <td className="py-2 pr-4">
                      {PLAN_NAMES[tx.planId] || tx.planId}
                    </td>
                    <td className="py-2 pr-4">{tx.credits}</td>
                    <td className="py-2 pr-4 font-semibold">
                      {formatStripeAmount(tx.amount, tx.currency)}
                    </td>
                    <td className="py-2 pr-4 capitalize text-xs text-gray-700">
                      {tx.status || "paid"}
                    </td>
                  </tr>
                ))}
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
    <p className="text-2xl font-semibold text-gray-800 break-words">
      {value}
    </p>
  </div>
);

export default PatientBilling;
