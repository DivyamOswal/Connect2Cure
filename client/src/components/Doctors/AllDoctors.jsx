// src/pages/AllDoctors.jsx
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import doctorData from "../../assets/Doctors/doctorData";

const AllDoctors = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="bg-[#E6E6E6] px-6 py-6 md:px-16 lg:px-24 xl:px-32 min-h-screen">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-3xl font-bold text-black">
          Our Trusted Doctors
        </h1>
      </div>

      {/* GRID RESPONSIVE */}
      <div className="
        grid 
        grid-cols-1
        sm:grid-cols-2
        md:grid-cols-3
        lg:grid-cols-4 
        gap-6
      ">
        {doctorData.map((doctor) => (
          <Link
            key={doctor.id}
            to={`/doctor/${doctor.id}`}
            state={{ source: "doctorData" }}
          >
            <div className="rounded-lg shadow hover:shadow-xl transition bg-white overflow-hidden cursor-pointer">

              {/* IMAGE */}
              <img
                src={doctor.image}
                alt={doctor.name}
                className="w-full h-72 object-cover rounded-t-lg"
              />

              {/* DETAILS */}
              <div className="p-4">
                <h2 className="font-semibold text-gray-800 text-lg">
                  {doctor.name}
                </h2>

                <p className="text-xs text-gray-600 mt-1">{doctor.degree}</p>

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
        ))}
      </div>
    </div>
  );
};

export default AllDoctors;
