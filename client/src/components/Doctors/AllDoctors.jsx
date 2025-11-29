// src/components/Doctors/AllDoctors.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";

const getDoctorImageUrl = (imagePath) => {
  if (!imagePath) return null; // don't render <img src="">
  return `http://localhost:5000${imagePath}`;
};

const AllDoctors = () => {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    api
      .get("/doctors")
      .then((res) => setDoctors(res.data))
      .catch((err) => {
        console.error("Failed to load doctors", err);
        setDoctors([]);
      });
  }, []);

  return (
    <div className="bg-[#E6E6E6] px-6 py-6 md:px-16 lg:px-24 xl:px-32 min-h-screen">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-3xl font-bold text-black">
          Our Trusted Doctors
        </h1>
      </div>

      <div
        className="
        grid 
        grid-cols-1
        sm:grid-cols-2
        md:grid-cols-3
        lg:grid-cols-4 
        gap-6
      "
      >
        {doctors.map((doctor) => {
          const imgSrc = getDoctorImageUrl(doctor.image);

          return (
            <Link
              key={doctor._id}
              to={`/doctor/${doctor._id}`}
              state={{ source: "doctorData" }}
            >
              <div className="rounded-lg shadow hover:shadow-xl transition bg-white overflow-hidden cursor-pointer">
                {imgSrc && (
                  <img
                    src={imgSrc}
                    alt={doctor.name}
                    className="w-full h-72 object-cover rounded-t-lg"
                  />
                )}

                <div className="p-4">
                  <h2 className="font-semibold text-gray-800 text-lg">
                    {doctor.name}
                  </h2>

                  <p className="text-xs text-gray-600 mt-1">
                    {doctor.degree}
                  </p>

                  <p className="text-sm text-[#FF8040] font-medium mt-1">
                    {doctor.specialization}
                  </p>

                  <p className="text-xs text-gray-500 mt-2">
                    📍 {doctor.location}
                  </p>

                  <p className="text-xs text-gray-700 mt-1">
                    ⭐ {doctor.rating} ({doctor.reviews} reviews)
                  </p>

                  <p className="text-sm font-semibold text-gray-900 mt-2">
                    Fee: ₹{doctor.fee}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default AllDoctors;
