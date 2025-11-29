// src/pages/Doctor/DoctorEarning.jsx
import { useEffect, useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import api from "../../api/axios";

const DoctorEarnings = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [range, setRange] = useState("all");

  useEffect(() => {
    api
      .get("/appointments/earnings")
      .then((res) => setData(res.data))
      .catch(() => setError("Failed to load earnings"));
  }, []);

  // Daily earnings
  const dailyEarnings = useMemo(() => {
    if (!data?.appointments) return [];
    const map = new Map();

    data.appointments.forEach((appt) => {
      if (!appt.date || !appt.fee) return;
      const key = appt.date;
      map.set(key, (map.get(key) || 0) + appt.fee);
    });

    return [...map.entries()]
      .map(([date, total]) => ({ date, total }))
      .sort((a, b) => (a.date < b.date ? -1 : 1));
  }, [data]);

  // Filter by range
  const filteredEarnings = useMemo(() => {
    if (range === "all") return dailyEarnings;

    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - (range === "30" ? 30 : 7));

    return dailyEarnings.filter((item) => new Date(item.date) >= cutoff);
  }, [dailyEarnings, range]);

  if (error)
    return (
      <div className="p-4">
        <p className="text-red-500">{error}</p>
      </div>
    );

  if (!data)
    return (
      <div className="p-4">
        <p>Loading earnings...</p>
      </div>
    );

  return (
    <div className="px-3 py-4 sm:p-6 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold">Earnings Overview</h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Track your consultation income over time.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <SummaryCard
          label="Total Earnings"
          value={`₹${data.totalEarnings?.toFixed
            ? data.totalEarnings.toFixed(2)
            : data.totalEarnings || 0}`}
          highlight
        />

        <SummaryCard
          label="Today’s Earnings"
          value={`₹${data.todayEarnings?.toFixed
            ? data.todayEarnings.toFixed(2)
            : data.todayEarnings || 0}`}
          highlight
        />

        <SummaryCard
          label="Confirmed Appointments"
          value={data.totalAppointments ?? 0}
        />
      </div>

      {/* Earnings Graph */}
      <div className="bg-white shadow rounded-lg p-4 sm:p-6 border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold">Earnings by Date</h2>
            <span className="text-[11px] sm:text-xs text-gray-500">
              Currency: {data.currency || "INR"}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <span className="text-gray-600">Range:</span>
            <select
              value={range}
              onChange={(e) => setRange(e.target.value)}
              className="border rounded px-2 py-1 text-xs sm:text-sm"
            >
              <option value="all">All time</option>
              <option value="30">Last 30 days</option>
              <option value="7">Last 7 days</option>
            </select>
          </div>
        </div>

        {filteredEarnings.length === 0 ? (
          <p className="text-gray-500">No earnings data available.</p>
        ) : (
          <div className="w-full h-49 sm:h-72 lg:h-49">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={filteredEarnings}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip
                  formatter={(v) => [`₹${v}`, "Earnings"]}
                  labelFormatter={(l) => `Date: ${l}`}
                />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#16a34a"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Earnings Table */}
      <div className="bg-white shadow rounded-lg p-4 sm:p-6 border">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">All Earnings</h2>

        {data.appointments.length === 0 ? (
          <p className="text-gray-500">No confirmed earnings yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b bg-gray-100">
                  <th className="p-3">Patient</th>
                  <th className="p-3 hidden sm:table-cell">Email</th>
                  <th className="p-3">Date</th>
                  <th className="p-3 hidden xs:table-cell">Time</th>
                  <th className="p-3">Fee</th>
                  <th className="p-3 hidden md:table-cell">Paid On</th>
                </tr>
              </thead>

              <tbody>
                {data.appointments.map((a) => {
                  const patient = a.patient || a.patientUser || {};
                  return (
                    <tr key={a._id} className="border-b hover:bg-gray-50">
                      <td className="p-3">{patient.name || "Patient"}</td>
                      <td className="p-3 text-gray-500 hidden sm:table-cell">
                        {patient.email || "-"}
                      </td>
                      <td className="p-3">{a.date}</td>
                      <td className="p-3 hidden xs:table-cell">{a.time}</td>

                      <td className="p-3 font-semibold text-green-600">
                        ₹{a.fee?.toFixed ? a.fee.toFixed(2) : a.fee}
                      </td>

                      <td className="p-3 hidden md:table-cell text-gray-600">
                        {a.createdAt
                          ? new Date(a.createdAt).toLocaleString()
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

const SummaryCard = ({ label, value, highlight }) => (
  <div className="bg-white shadow rounded-lg p-4 sm:p-5 border">
    <p className="text-xs sm:text-sm text-gray-500 mb-1">{label}</p>

    <p
      className={`text-2xl sm:text-3xl font-bold ${
        highlight ? "text-green-600" : "text-gray-900"
      }`}
    >
      {value}
    </p>
  </div>
);

export default DoctorEarnings;
