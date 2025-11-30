// src/pages/PatientDoctor.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";

const PatientDoctor = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          window.location.href = "/login/patient";
          return;
        }

        const res = await api.get("/appointments/my");
        const appts = res.data || [];

        const map = new Map();

        appts.forEach((appt) => {
          const doc = appt.doctor;
          if (!doc || !doc._id) return;

          const docId = doc._id.toString();
          const existing = map.get(docId);

          const dt = new Date(`${appt.date}T${appt.time || "00:00"}`).getTime();

          if (!existing) {
            map.set(docId, {
              doctor: doc,
              totalVisits: 1,
              lastAppointment: dt,
            });
          } else {
            existing.totalVisits += 1;
            if (dt > existing.lastAppointment) {
              existing.lastAppointment = dt;
            }
          }
        });

        const list = Array.from(map.values()).sort(
          (a, b) => b.lastAppointment - a.lastAppointment
        );

        setDoctors(list);
      } catch (err) {
        console.error("PATIENT DOCTORS ERROR:", err);
        setError(
          err?.response?.data?.message || err.message || "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  if (loading) {
    return <p className="text-gray-500 px-4 py-4">Loading doctors...</p>;
  }

  if (error) {
    return (
      <div className="text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2 inline-block m-4">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-2">My Doctors</h1>
      <p className="text-sm text-gray-500 mb-6">
        Doctors you&apos;ve consulted or booked appointments with.
      </p>

      {doctors.length === 0 ? (
        <p className="text-sm text-gray-500">
          You haven&apos;t booked any appointments yet.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {doctors.map(({ doctor, totalVisits, lastAppointment }) => {
            const lastVisitDate = new Date(lastAppointment);

            // Build image URL if you store relative path on doctor.image
            const BACKEND =
              import.meta.env.VITE_BACKEND_ORIGIN || "http://localhost:5000";

            const imgSrc = doctor.image ? `${BACKEND}${doctor.image}` : null;

            return (
              <div
                key={doctor._id}
                className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden flex flex-col"
              >
                {/* IMAGE */}
                {imgSrc && (
                  <img
                    src={imgSrc}
                    alt={doctor.name}
                    className="w-full h-40 object-cover"
                  />
                )}

                {/* BODY */}
                <div className="p-4 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h2 className="font-semibold text-gray-900 text-lg">
                        {doctor.name}
                      </h2>

                      {doctor.specialization && (
                        <p className="text-sm text-[#FF8040] font-medium mt-0.5">
                          {doctor.specialization}
                        </p>
                      )}

                      {doctor.location && (
                        <p className="text-xs text-gray-500 mt-1">
                          📍 {doctor.location}
                        </p>
                      )}
                    </div>

                    {doctor.fee && (
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Consultation</p>
                        <p className="text-sm font-semibold text-gray-900">
                          ₹{doctor.fee}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* VISITS INFO */}
                  <div className="mt-3 text-xs text-gray-600 space-y-1">
                    <p>
                      Total visits:{" "}
                      <span className="font-semibold">{totalVisits}</span>
                    </p>
                    <p>
                      Last visit:{" "}
                      <span className="font-semibold">
                        {lastVisitDate.toLocaleString()}
                      </span>
                    </p>
                  </div>

                  {/* TAGS / BADGES */}
                  <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
                    {doctor.rating !== undefined && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700">
                        ⭐ {doctor.rating ?? "-"}{" "}
                        {doctor.reviews ? `(${doctor.reviews} reviews)` : ""}
                      </span>
                    )}
                    <span className="inline-flex px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                      Last consulted patient
                    </span>
                  </div>

                  {/* ACTIONS */}
                  <div className="mt-4 flex gap-2">
                    <Link
                      to={`/doctor/${doctor._id}`}
                      className="flex-1 inline-flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium border border-gray-200 hover:bg-gray-50"
                    >
                      View Profile
                    </Link>
                    <Link
                      to={`/doctor/${doctor._id}`}
                      state={{ source: "myDoctors" }}
                      className="flex-1 inline-flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium bg-[#FF8040] text-white hover:bg-black"
                    >
                      Book Again
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PatientDoctor;
