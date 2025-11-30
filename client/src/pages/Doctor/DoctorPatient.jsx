// src/pages/Doctor/DoctorPatient.jsx
import React, { useEffect, useState } from "react";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const DoctorPatient = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          window.location.href = "/login/doctor";
          return;
        }

        // DoctorPatient.jsx
        const res = await fetch(`${API_BASE}/appointments/doctor`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (res.status === 401) {
          localStorage.clear();
          window.location.href = "/login/doctor";
          return;
        }

        if (res.status === 403) {
          throw new Error(
            "Forbidden – this endpoint is not allowed for your role."
          );
        }

        if (!res.ok) {
          throw new Error(data.message || "Failed to load patients");
        }

        // data = list of appointments with populated patientUser
        const byPatient = new Map();

        (data || []).forEach((appt) => {
          const p = appt.patient || appt.patientUser;
          if (!p || !p._id) return;

          const existing = byPatient.get(p._id) || {
            patient: p,
            totalAppointments: 0,
            lastAppointment: null,
          };

          existing.totalAppointments += 1;

          const apptDateTime = new Date(`${appt.date}T${appt.time || "00:00"}`);
          if (
            !existing.lastAppointment ||
            apptDateTime > existing.lastAppointment
          ) {
            existing.lastAppointment = apptDateTime;
          }

          byPatient.set(p._id, existing);
        });

        setPatients(Array.from(byPatient.values()));
      } catch (err) {
        console.error("DOCTOR PATIENTS ERROR:", err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  if (loading) {
    return <p className="text-gray-500">Loading patients...</p>;
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
      <h1 className="text-2xl font-semibold mb-4">My Patients</h1>

      {patients.length === 0 ? (
        <p className="text-sm text-gray-500">
          No patients found yet. Patients will appear here after they book
          appointments with you.
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {patients.map(({ patient, totalAppointments, lastAppointment }) => (
            <div
              key={patient._id}
              className="bg-white rounded-xl shadow border p-4 flex flex-col gap-3"
            >
              {/* Top: patient info */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h2 className="text-base font-semibold">
                    {patient.name || "Unknown patient"}
                  </h2>
                  <p className="text-xs text-gray-500">
                    {patient.email || "-"}
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="text-sm space-y-1">
                <p>
                  <span className="font-medium text-gray-700">
                    Total appointments:{" "}
                  </span>
                  <span className="text-gray-800">{totalAppointments}</span>
                </p>
                <p>
                  <span className="font-medium text-gray-700">
                    Last appointment:{" "}
                  </span>
                  <span className="text-gray-800">
                    {lastAppointment ? lastAppointment.toLocaleString() : "—"}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorPatient;
