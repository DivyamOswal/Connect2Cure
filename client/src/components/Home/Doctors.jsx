// src/components/Home/Doctors.jsx
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { Link } from "react-router-dom";

import Title from "../Title";
import api from "../../api/axios";

// Helper to turn /uploads/... into full URL
const getDoctorImageUrl = (imagePath) => {
  if (!imagePath) return null;

  const backendOrigin = import.meta.env.VITE_BACKEND_ORIGIN;
  return `${backendOrigin}${imagePath}`;
};


const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/doctors")
      .then((res) => {
        setDoctors(res.data || []);
      })
      .catch((err) => {
        console.error("Failed to load doctors", err);
        setDoctors([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-[#E6E6E6] px-6 py-5 md:px-16 lg:px-24 xl:px-32 overflow-hidden">
      <Title title="Meet Our Doctors" subtitle="Your Health, Our Expert Hands" />

      <div className="mx-auto">
        {loading && (
          <p className="text-center text-sm text-gray-600 py-4">
            Loading doctors...
          </p>
        )}

        {!loading && doctors.length === 0 && (
          <p className="text-center text-sm text-gray-600 py-4">
            No doctors available right now.
          </p>
        )}

        {!loading && doctors.length > 0 && (
          <Swiper
            modules={[Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            autoplay={{ delay: 2500, disableOnInteraction: false }}
            loop={doctors.length > 1}
            breakpoints={{
              640: { slidesPerView: 1 }, // mobile
              768: { slidesPerView: 2 }, // tablet
              1024: { slidesPerView: 4 }, // desktop
            }}
            aria-live="polite"
          >
            {doctors.map((doctor) => {
              const imgSrc = getDoctorImageUrl(doctor.image);

              return (
                <SwiperSlide key={doctor._id} className="pt-4">
                  <Link
                    to={`/doctor/${doctor._id}`}
                    state={{ source: "doctorData" }}
                    aria-label={`View details for ${doctor.name}`}
                  >
                    <div className="rounded-lg shadow hover:shadow-lg transition bg-white overflow-hidden">
                      {imgSrc && (
                        <img
                          src={imgSrc}
                          alt={doctor.name}
                          loading="lazy"
                          className="w-full h-60 object-cover rounded-t-lg"
                        />
                      )}

                      <div className="p-3">
                        <h2 className="font-semibold text-sm mt-2">
                          {doctor.name}
                        </h2>

                        <p className="text-xs text-gray-600">
                          {doctor.degree}
                        </p>

                        <p className="text-sm text-[#FF8040] font-medium">
                          {doctor.specialization}
                        </p>

                        <p className="text-xs text-gray-500 mt-1">
                          📍 {doctor.location}
                        </p>

                        {doctor.rating !== undefined && (
                          <p className="text-xs text-gray-700 mt-1">
                            ⭐ {doctor.rating} ({doctor.reviews} reviews)
                          </p>
                        )}

                        {doctor.fee !== undefined && (
                          <p className="text-sm font-semibold text-gray-900 mt-2">
                            Fee: ₹{doctor.fee}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              );
            })}
          </Swiper>
        )}

        <div className="flex items-center justify-center pt-7">
          <Link to="/doctors">
            <button className="border px-6 py-2 rounded hover:border-[#FF8040] hover:bg-white transition-colors">
              More Doctors
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Doctors;
