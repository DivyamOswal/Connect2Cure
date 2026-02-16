import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import api from "../../api/axios";

const PatientBilling = () => {
  const { t } = useTranslation("billing");

  const PLAN_NAMES = {
    basic: t("plans.basic"),
    pro: t("plans.pro"),
    premium: t("plans.premium"),
  };

  const [payments, setPayments] = useState([]);
  const [summary, setSummary] = useState({ totalPaid: 0, totalCount: 0 });

  const [creditTxs, setCreditTxs] = useState([]);
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
        setError(
          err?.response?.data?.message ||
            t("errors.generic")
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBilling();
  }, [t]);

  if (loading) {
    return (
      <p className="text-gray-500 px-4 py-4">
        {t("loading")}
      </p>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2 inline-block m-4">
        {error}
      </div>
    );
  }

  const formatStripeAmount = (amountMinor, currency = "inr") => {
    const major = (amountMinor || 0) / 100;
    const upper = currency?.toUpperCase?.() || "INR";
    if (upper === "INR") return `₹${major.toFixed(2)}`;
    return `${upper} ${major.toFixed(2)}`;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-2">
          {t("title")}
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          {t("subtitle")}
        </p>
      </div>

      {/* SUMMARY */}
      <div className="grid gap-4 mb-2 sm:grid-cols-3">
        <SummaryCard
          label={t("summary.totalPaid")}
          value={`₹${summary.totalPaid}`}
        />
        <SummaryCard
          label={t("summary.totalAppointments")}
          value={summary.totalCount}
        />
        <SummaryCard
          label={t("summary.totalCredits")}
          value={`${creditSummary.totalCredits} ${t(
            "credits"
          )} (${formatStripeAmount(
            creditSummary.totalAmount
          )})`}
        />
      </div>

      {/* APPOINTMENTS */}
      <div className="bg-white rounded-xl shadow p-4 space-y-3">
        <h2 className="text-lg font-medium">
          {t("appointments.title")}
        </h2>

        {payments.length === 0 ? (
          <p className="text-sm text-gray-500">
            {t("appointments.empty")}
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead className="text-left text-gray-500 border-b">
              <tr>
                <th>{t("table.doctor")}</th>
                <th>{t("table.datetime")}</th>
                <th>{t("table.amount")}</th>
                <th>{t("table.status")}</th>
                <th>{t("table.paymentId")}</th>
                <th>{t("table.paidAt")}</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((a) => (
                <tr key={a._id} className="border-b">
                  <td>{a.doctor?.name || t("unknownDoctor")}</td>
                  <td>
                    {a.date} {a.time && `at ${a.time}`}
                  </td>
                  <td>₹{a.fee || a.amount}</td>
                  <td>{a.paymentStatus || a.status}</td>
                  <td>{a.transactionId || "-"}</td>
                  <td>
                    {a.paidAt
                      ? new Date(a.paidAt).toLocaleString()
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* CREDITS */}
      <div className="bg-white rounded-xl shadow p-4 space-y-3">
        <h2 className="text-lg font-medium">
          {t("creditsTitle")}
        </h2>

        {creditTxs.length === 0 ? (
          <p className="text-sm text-gray-500">
            {t("creditsEmpty")}{" "}
            <a href="/plans" className="text-blue-600 underline">
              {t("plansLink")}
            </a>
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead className="text-left text-gray-500 border-b">
              <tr>
                <th>{t("table.date")}</th>
                <th>{t("table.plan")}</th>
                <th>{t("table.credits")}</th>
                <th>{t("table.amount")}</th>
                <th>{t("table.status")}</th>
              </tr>
            </thead>
            <tbody>
              {creditTxs.map((tx) => (
                <tr key={tx._id} className="border-b">
                  <td>
                    {tx.createdAt
                      ? new Date(tx.createdAt).toLocaleString()
                      : "-"}
                  </td>
                  <td>{PLAN_NAMES[tx.planId] || tx.planId}</td>
                  <td>{tx.credits}</td>
                  <td>
                    {formatStripeAmount(tx.amount, tx.currency)}
                  </td>
                  <td>{tx.status || "paid"}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
