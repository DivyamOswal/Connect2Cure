import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { analyzeReport, analyzeReportFile } from "../api/reportApi";
import { getMe } from "../api/userApi";

import ReportForm from "../components/ReportForm";
import ReportSummary from "../components/ReportSummary";
import ChartsSection from "../components/ChartsSection";
import ReportActions from "../components/ReportActions";

export default function NewSummaryPage() {
  const navigate = useNavigate();
  const { t } = useTranslation("summary");

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
        if (err?.response?.status === 401) {
          navigate("/login/patient");
        } else {
          setError(
            err?.response?.data?.message ||
              t("errors.loadUser")
          );
        }
      }
    })();
  }, [navigate, t]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { report: r, remainingCredits } =
        await analyzeReport(reportText);

      setReport(r);
      setSummary(r.summary);
      setMedicalTerms(r.medicalTerms || []);
      setCharts(r.charts || null);
      setCredits(remainingCredits);
    } catch (err) {
      if (err?.response?.status === 401) {
        navigate("/login/patient");
      } else if (err?.response?.status === 402) {
        navigate("/plans");
      } else {
        setError(
          err?.response?.data?.message ||
            t("errors.analyzeText")
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFileSubmit = async (e, file) => {
    e.preventDefault();
    setError("");

    if (!file) {
      setError(t("errors.noFile"));
      return;
    }

    setLoading(true);

    try {
      const { report: r, remainingCredits } =
        await analyzeReportFile(file);

      setReport(r);
      setSummary(r.summary);
      setMedicalTerms(r.medicalTerms || []);
      setCharts(r.charts || null);
      setCredits(remainingCredits);
    } catch (err) {
      if (err?.response?.status === 401) {
        navigate("/login/patient");
      } else if (err?.response?.status === 402) {
        navigate("/plans");
      } else {
        setError(
          err?.response?.data?.message ||
            t("errors.analyzeFile")
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
          {t("title")}
        </h1>
        <p className="text-sm">
          {t("credits")}{" "}
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

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">
          {t("option1.title")}
        </h2>
        <ReportForm
          reportText={reportText}
          setReportText={setReportText}
          handleSubmit={handleSubmit}
          loading={loading}
        />
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">
          {t("option2.title")}
        </h2>
        <ReportForm
          handleFileSubmit={handleFileSubmit}
          loading={loading}
        />
      </section>

      <ReportSummary summary={summary} medicalTerms={medicalTerms} />
      <ChartsSection charts={charts} medicalTerms={medicalTerms} />

      {report && <ReportActions report={report} />}
    </div>
  );
}
