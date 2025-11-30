// src/pages/SharedReportPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSharedReport } from "../api/reportApi";
import ReportSummary from "../components/ReportSummary";
import ChartsSection from "../components/ChartsSection";

export default function SharedReportPage() {
  const { shareId } = useParams();
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getSharedReport(shareId);
        setReport(data);
      } catch (err) {
        console.error("getSharedReport error:", err);
        setError(
          err?.response?.data?.message ||
            "Failed to load shared report."
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [shareId]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (error)
    return (
      <p className="p-6 text-red-600 text-sm">
        {error}
      </p>
    );

  if (!report)
    return (
      <p className="p-6 text-sm">
        Report not found.
      </p>
    );

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold">
        Shared Medical Summary
      </h1>

      <ReportSummary
        summary={report.summary}
        medicalTerms={report.medicalTerms}
      />

      <ChartsSection
        charts={report.charts}
        medicalTerms={report.medicalTerms}
      />
    </div>
  );
}
