// src/pages/PatientDashboard.jsx
import React, { useEffect, useState } from "react";
import api from "../../api/axios";


const PatientDashboard = () => {
  const [stats, setStats] = useState(null);
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          window.location.href = "/login/patient";
          return;
        }

        const res = await api.get("/appointments/my");

        const appts = res.data || [];

        const now = new Date();

        // upcoming = confirmed & datetime in the future
        const upcomingAppts = appts
          .filter((a) => {
            if (a.status !== "confirmed") return false;
            // date is string "YYYY-MM-DD", time "HH:mm"
            const dtString = a.time
              ? `${a.date}T${a.time}`
              : `${a.date}T00:00`;
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
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-4">My Health Overview</h1>

      <div className="grid gap-4 mb-6 sm:grid-cols-2">
        <DashboardCard
          label="Total appointments"
          value={stats?.totalAppointments ?? 0}
        />
        <DashboardCard
          label="Upcoming appointments"
          value={stats?.upcomingAppointments ?? 0}
        />
      </div>

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
