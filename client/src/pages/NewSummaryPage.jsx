// src/pages/NewSummaryPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { analyzeReport, analyzeReportFile } from "../api/reportApi"; // 👈 UPDATED
import { getMe } from "../api/userApi";

import ReportForm from "../components/ReportForm";
import ReportSummary from "../components/ReportSummary";
import ChartsSection from "../components/ChartsSection";
import ReportActions from "../components/ReportActions";

export default function NewSummaryPage() {
  const navigate = useNavigate();

  const [reportText, setReportText] = useState("");
  const [report, setReport] = useState(null);
  const [summary, setSummary] = useState("");
  const [medicalTerms, setMedicalTerms] = useState([]);
  const [charts, setCharts] = useState(null);
  const [credits, setCredits] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const user = await getMe();
        setCredits(user.credits ?? 0);
      } catch (err) {
        console.error("getMe error:", err);

        if (err?.response?.status === 401) {
          navigate("/login/patient");
          return;
        }

        setError(
          err?.response?.data?.message ||
            "Failed to load user information."
        );
      }
    })();
  }, [navigate]);

  // 👉 TEXT submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { report: r, remainingCredits } =
        await analyzeReport(reportText);

      console.log("charts from backend (text):", r.charts);

      setReport(r);
      setSummary(r.summary);
      setMedicalTerms(r.medicalTerms || []);
      setCharts(r.charts || null);
      setCredits(remainingCredits);
    } catch (err) {
      console.error("analyzeReport error:", err);

      if (err?.response?.status === 401) {
        navigate("/login/patient");
      } else if (err?.response?.status === 402) {
        navigate("/plans");
      } else {
        setError(
          err?.response?.data?.message ||
            "Something went wrong while analyzing."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // 👉 FILE submit
  const handleFileSubmit = async (e, file) => {
    e.preventDefault();
    setError("");

    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    setLoading(true);

    try {
      const { report: r, remainingCredits } =
        await analyzeReportFile(file);

      console.log("charts from backend (file):", r.charts);

      setReport(r);
      setSummary(r.summary);
      setMedicalTerms(r.medicalTerms || []);
      setCharts(r.charts || null);
      setCredits(remainingCredits);
    } catch (err) {
      console.error("analyzeReportFile error:", err);

      if (err?.response?.status === 401) {
        navigate("/login/patient");
      } else if (err?.response?.status === 402) {
        navigate("/plans");
      } else {
        setError(
          err?.response?.data?.message ||
            "Something went wrong while analyzing the file."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          AI Medical Summary
        </h1>
        <p className="text-sm">
          Credits:{" "}
          <span className="font-semibold text-green-600">
            {credits}
          </span>
        </p>
      </header>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 border border-red-200 px-3 py-2 rounded-md">
          {error}
        </p>
      )}

      {/* 🔹 Option 1: Paste text */}
      <section className="space-y-2">
        <h2 className="text-lg font-semibold">
          Option 1: Paste medical report text
        </h2>
        <ReportForm
          reportText={reportText}
          setReportText={setReportText}
          handleSubmit={handleSubmit}
          loading={loading}
        />
      </section>

      {/* 🔹 Option 2: Upload report file */}
      <section className="space-y-2">
        <h2 className="text-lg font-semibold">
          Option 2: Upload medical report file
        </h2>
        <ReportForm
          handleFileSubmit={handleFileSubmit} // 👈 triggers FILE MODE of ReportForm
          loading={loading}
        />
      </section>

      <ReportSummary
        summary={summary}
        medicalTerms={medicalTerms}
      />

      <ChartsSection
        charts={charts}
        medicalTerms={medicalTerms}
      />

      {report && (
        <ReportActions report={report} />
      )}
    </div>
  );
}
