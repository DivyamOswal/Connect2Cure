// src/pages/DoctorDashboard.jsx
import React, { useEffect, useState } from "react";

const formatDateTime = (date, time) => {
  if (!date && !time) return "-";
  if (!date) return time;
  if (!time) return date;

  try {
    let normalizedTime = time;
    if (time.length === 5) normalizedTime = `${time}:00`;

    const iso = `${date}T${normalizedTime}`;
    const dt = new Date(iso);

    if (Number.isNaN(dt.getTime())) return `${date} ${time}`;

    return dt.toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return `${date} ${time}`;
  }
};

const DoctorDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          window.location.href = "/login/doctor";
          return;
        }

        const res = await fetch(
          "http://localhost:5000/api/dashboard/doctor/summary",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await res.json();

        if (res.status === 401) {
          localStorage.clear();
          window.location.href = "/login/doctor";
          return;
        }

        if (!res.ok) {
          throw new Error(data.message || "Failed to load dashboard");
        }

        setStats(data.stats);
        setRecent(data.recentAppointments || []);
      } catch (err) {
        console.error("DOCTOR DASHBOARD ERROR:", err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  // ---------- APPROVE APPOINTMENT ----------
  const approveAppointment = async (id) => {
  try {
    setBtnLoading(id);
    const token = localStorage.getItem("accessToken");
    if (!token) {
      window.location.href = "/login/doctor";
      return;
    }

    const res = await fetch(
      `http://localhost:5000/api/appointments/${id}/confirm`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();

    if (res.status === 401) {
      localStorage.clear();
      window.location.href = "/login/doctor";
      return;
    }

    if (!res.ok) {
      alert(data.message || "Failed to approve");
      return;
    }

    // ✅ update that one appointment’s status using backend value
    setRecent((prev) =>
      prev.map((a) =>
        a._id === id ? { ...a, status: data.appointment.status } : a
      )
    );
  } catch (err) {
    console.error("Approve error:", err);
    alert("Failed to approve appointment");
  } finally {
    setBtnLoading("");
  }
};


  if (loading) return <p className="text-gray-500">Loading dashboard...</p>;

  if (error)
    return (
      <div className="text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2 inline-block">
        {error}
      </div>
    );

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Doctor Overview</h1>

      {/* Stats cards */}
      <div className="grid gap-4 mb-6 md:grid-cols-4 sm:grid-cols-2">
        <DashboardCard label="Total appointments" value={stats?.totalAppointments ?? 0} />
        <DashboardCard label="Upcoming appointments" value={stats?.upcomingAppointments ?? 0} />
        <DashboardCard label="Today's appointments" value={stats?.todayAppointments ?? 0} />
        <DashboardCard label="Unread messages" value={stats?.unreadMessages ?? 0} />
      </div>

      {/* Recent appointments */}
      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="text-lg font-medium mb-3">Next appointments</h2>

        {recent.length === 0 ? (
          <p className="text-sm text-gray-500">No upcoming appointments.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="text-left text-gray-500 border-b">
              <tr>
                <th className="py-2">Patient</th>
                <th className="py-2">Email</th>
                <th className="py-2">Date &amp; time</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>

            <tbody>
              {recent.map((appt) => {
                const patient = appt.patient || appt.patientUser || {};
                return (
                  <tr key={appt._id} className="border-b last:border-b-0">
                    <td className="py-2">{patient?.name || "Unknown patient"}</td>

                    <td className="py-2 text-gray-500">{patient?.email || "-"}</td>

                    <td className="py-2">{formatDateTime(appt.date, appt.time)}</td>

                    <td className="py-2 capitalize">
                      {appt.status === "pending" ? (
                        <button
                          onClick={() => approveAppointment(appt._id)}
                          disabled={btnLoading === appt._id}
                          className={`px-3 py-1 rounded-lg text-white text-xs 
                            ${
                              btnLoading === appt._id
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-green-600 hover:bg-green-700"
                            }`}
                        >
                          {btnLoading === appt._id ? "Approving..." : "Approve"}
                        </button>
                      ) : (
                        <span className="text-green-600 font-medium">Confirmed</span>
                      )}
                    </td>
                  </tr>
                );
              })}
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

export default DoctorDashboard;
