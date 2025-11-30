// src/pages/DoctorAppointments.jsx
import React, { useEffect, useState } from "react";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";


const formatDateTime = (date, time) => {
  if (!date && !time) return "-";
  if (!date) return time;
  if (!time) return date;

  try {
    // If time is "HH:mm", make it "HH:mm:00"
    let normalizedTime = time;
    if (time.length === 5) {
      normalizedTime = `${time}:00`;
    }

    const iso = `${date}T${normalizedTime}`;
    const dt = new Date(iso);

    if (Number.isNaN(dt.getTime())) {
      return `${date} ${time}`;
    }

    return dt.toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return `${date} ${time}`;
  }
};

const statusColorClasses = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          window.location.href = "/login/doctor";
          return;
        }

        const res = await fetch(`${API_BASE}/api/appointments/doctor`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.status === 401) {
          localStorage.clear();
          window.location.href = "/login/doctor";
          return;
        }

        if (!res.ok) {
          throw new Error(data.message || "Failed to load appointments");
        }

        setAppointments(data || []);
      } catch (err) {
        console.error("DOCTOR APPOINTMENTS ERROR:", err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  if (loading) {
    return <p className="text-gray-500">Loading appointments...</p>;
  }

  if (error) {
    return (
      <div className="text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2 inline-block">
        {error}
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">All Appointments</h1>

      {appointments.length === 0 ? (
        <p className="text-sm text-gray-500">No appointments found.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {appointments.map((appt) => {
            const patient = appt.patient || appt.patientUser || {};
            const statusClass =
              statusColorClasses[appt.status] || "bg-gray-100 text-gray-800";

            return (
              <div
                key={appt._id}
                className="bg-white rounded-xl shadow border p-4 flex flex-col gap-3"
              >
                {/* Top: patient & status */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="text-base font-semibold">
                      {patient?.name || "Unknown patient"}
                    </h2>
                    <p className="text-xs text-gray-500">
                      {patient?.email || "-"}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full capitalize ${statusClass}`}
                  >
                    {appt.status}
                  </span>
                </div>

                {/* Date / Time / Fee */}
                <div className="text-sm space-y-1">
                  <p>
                    <span className="font-medium text-gray-700">
                      Date &amp; time:{" "}
                    </span>
                    <span className="text-gray-800">
                      {formatDateTime(appt.date, appt.time)}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium text-gray-700">Fee: </span>
                    <span className="text-gray-800">
                      ₹{appt.fee?.toFixed ? appt.fee.toFixed(2) : appt.fee || 0}
                    </span>
                  </p>
                </div>

                {/* Payment info (no Stripe IDs) */}
                <div className="text-xs text-gray-500 space-y-1 border-t pt-2 mt-1">
                  <p>
                    <span className="font-medium text-gray-600">
                      Payment status:
                    </span>{" "}
                    {appt.status === "confirmed"
                      ? "Paid"
                      : appt.status === "cancelled"
                      ? "Not charged / refunded"
                      : "Pending payment or confirmation"}
                  </p>
                </div>

                {/* Meta info */}
                <div className="text-[11px] text-gray-400 border-t pt-2 mt-1">
                  <p>
                    Booked on:{" "}
                    {appt.createdAt
                      ? new Date(appt.createdAt).toLocaleString()
                      : "-"}
                  </p>
                  {appt.updatedAt && (
                    <p>
                      Last updated:{" "}
                      {new Date(appt.updatedAt).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DoctorAppointments;
