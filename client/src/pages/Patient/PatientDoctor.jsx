// src/pages/PatientDoctor.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api from "../../api/axios";
import { getDoctorImageUrl } from "../../utils/imageUrl";

const PatientDoctor = () => {
  const { t } = useTranslation("patientdoctor");

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

          const dt = new Date(`${appt.date}T${appt.time || "00:00"}`).getTime();
          const existing = map.get(doc._id);

          if (!existing) {
            map.set(doc._id, {
              doctor: doc,
              totalVisits: 1,
              lastAppointment: dt,
            });
          } else {
            existing.totalVisits += 1;
            existing.lastAppointment = Math.max(existing.lastAppointment, dt);
          }
        });

        setDoctors(
          Array.from(map.values()).sort(
            (a, b) => b.lastAppointment - a.lastAppointment,
          ),
        );
      } catch (err) {
        setError(
          err?.response?.data?.message || err.message || t("errors.generic"),
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [t]);

  if (loading) {
    return <p className="text-gray-500 px-4 py-4">{t("loading")}</p>;
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
      <h1 className="text-2xl font-semibold mb-2">{t("title")}</h1>
      <p className="text-sm text-gray-500 mb-6">{t("subtitle")}</p>

      {doctors.length === 0 ? (
        <p className="text-sm text-gray-500">{t("empty")}</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {doctors.map(({ doctor, totalVisits, lastAppointment }) => {
            const imgSrc = getDoctorImageUrl(doctor.image);

            return (
              <div
                key={doctor._id}
                className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden flex flex-col"
              >
                {imgSrc && (
                  <img
                    src={imgSrc}
                    alt={doctor.name}
                    className="w-full h-full object-cover"
                  />
                )}

                <div className="p-4 flex flex-col flex-1">
                  <h2 className="font-semibold text-lg">{doctor.name}</h2>

                  {doctor.specialization && (
                    <p className="text-sm text-[#FF8040]">
                      {doctor.specialization}
                    </p>
                  )}

                  {doctor.location && (
                    <p className="text-xs text-gray-500 mt-1">
                      📍 {doctor.location}
                    </p>
                  )}

                  <div className="mt-3 text-xs text-gray-600">
                    <p>
                      {t("totalVisits")}{" "}
                      <span className="font-semibold">{totalVisits}</span>
                    </p>
                    <p>
                      {t("lastVisit")}{" "}
                      <span className="font-semibold">
                        {new Date(lastAppointment).toLocaleString()}
                      </span>
                    </p>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Link
                      to={`/doctor/${doctor._id}`}
                      className="flex-1 border rounded-lg py-2 text-sm text-center"
                    >
                      {t("viewProfile")}
                    </Link>
                    <Link
                      to={`/doctor/${doctor._id}`}
                      state={{ source: "myDoctors" }}
                      className="flex-1 bg-[#FF8040] text-white rounded-lg py-2 text-sm text-center"
                    >
                      {t("bookAgain")}
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
