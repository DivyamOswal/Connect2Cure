// src/pages/PatientDashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import ReportForm from "../../components/ReportForm";
import ReportSummary from "../../components/ReportSummary";
import ChartsSection from "../../components/ChartsSection";
import api from "../../api/axios";
import { analyzeReportFile } from "../../api/reportApi";

const PatientDashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // NEW: summary + charts state
  const [credits, setCredits] = useState(0);
  const [summary, setSummary] = useState("");
  const [medicalTerms, setMedicalTerms] = useState([]);
  const [charts, setCharts] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState("");

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          window.location.href = "/login/patient";
          return;
        }

        // appointments + user info
        const [apptRes, meRes] = await Promise.all([
          api.get("/appointments/my"),
          api.get("/auth/me"),
        ]);

        const appts = apptRes.data || [];
        const now = new Date();

        const upcomingAppts = appts
          .filter((a) => {
            if (a.status !== "confirmed") return false;
            const dtString = a.time ? `${a.date}T${a.time}` : `${a.date}T00:00`;
            const when = new Date(dtString);
            return when >= now;
          })
          .sort((a, b) => {
            const da = new Date(`${a.date}T${a.time || "00:00"}`).getTime();
            const db = new Date(`${b.date}T${b.time || "00:00"}`).getTime();
            return da - db;
          });

        setStats({
          totalAppointments: appts.length,
          upcomingAppointments: upcomingAppts.length,
        });

        setUpcoming(upcomingAppts);

        // set credits from /auth/me
        setCredits(meRes.data?.credits ?? 0);
      } catch (err) {
        console.error("PATIENT DASHBOARD ERROR:", err);
        setError(
          err?.response?.data?.message || err.message || "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  // 🔥 THIS IS YOUR FUNCTION, wired in:
  const handleFileSubmit = async (e, file) => {
    e.preventDefault();
    setAnalysisError("");
    setAnalyzing(true);

    try {
      const { report, remainingCredits } = await analyzeReportFile(file);

      setSummary(report.summary);
      setMedicalTerms(report.medicalTerms);
      setCharts(report.charts);
      setCredits(remainingCredits);
    } catch (err) {
      if (err?.response?.status === 402) {
        navigate("/plans");
      } else {
        setAnalysisError("Failed to analyze report.");
      }
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) {
    return <p className="text-gray-500 px-4 py-4">Loading dashboard...</p>;
  }

  if (error) {
    return (
      <div className="text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2 inline-block m-4">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">My Health Overview</h1>
        <div className="text-sm">
          Credits:{" "}
          <span className="font-semibold text-green-600">{credits}</span>
        </div>
      </div>

      {/* stats */}
      <div className="grid gap-4 mb-2 sm:grid-cols-2">
        <DashboardCard
          label="Total appointments"
          value={stats?.totalAppointments ?? 0}
        />
        <DashboardCard
          label="Upcoming appointments"
          value={stats?.upcomingAppointments ?? 0}
        />
      </div>

      {/* upcoming appointments */}
      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="text-lg font-medium mb-3">Upcoming appointments</h2>
        {upcoming.length === 0 ? (
          <p className="text-sm text-gray-500">No upcoming appointments.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="text-left text-gray-500 border-b">
              <tr>
                <th className="py-2">Doctor</th>
                <th className="py-2">Email</th>
                <th className="py-2">Date & time</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>

            <tbody>
              {upcoming.map((appt) => (
                <tr key={appt._id} className="border-b last:border-b-0">
                  <td className="py-2">
                    {appt.doctor?.name || "Unknown doctor"}
                  </td>
                  <td className="py-2 text-gray-500">
                    {appt.doctor?.email || "-"}
                  </td>
                  <td className="py-2">
                    {appt.date} {appt.time && `at ${appt.time}`}
                  </td>
                  <td className="py-2 capitalize">{appt.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      
    </div>
  );
};

const DashboardCard = ({ label, value }) => (
  <div className="bg-white rounded-xl shadow p-4">
    <p className="text-xs text-gray-500 mb-1">{label}</p>
    <p className="text-2xl font-semibold text-gray-800">{value}</p>
  </div>
);

export default PatientDashboard;
