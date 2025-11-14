// src/components/Home/Doctors.jsx
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";

import Title from "../Title";
import doctorData from "../../assets/Home/Doctors/doctorData";
import { Link } from "react-router-dom";

const Doctors = () => {
  return (
    <div className="bg-[#E6E6E6] px-6 py-5 md:px-16 lg:px-24 xl:px-32 overflow-hidden">
      <Title title="Meet Our Doctors" />

      <div className="mx-auto">
        <Swiper
          modules={[Autoplay]}
          spaceBetween={24}
          slidesPerView={1}
          autoplay={{ delay: 2500, disableOnInteraction: false }}
          loop={true}
          breakpoints={{
            640: { slidesPerView: 1 }, // mobile
            768: { slidesPerView: 2 }, // tablet
            1024: { slidesPerView: 4 }, // desktop
          }}
          aria-live="polite"
        >
          {doctorData.map((doctor) => (
            <SwiperSlide key={doctor.id} className="pt-4">
              <Link
                to={`/doctor/${doctor.id}`}
                state={{ source: "doctorData" }}
                aria-label={`View details for ${doctor.name}`}
              >
                <div className="rounded-lg shadow hover:shadow-lg transition bg-white overflow-hidden">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    loading="lazy"
                    className="w-full h-80 object-cover rounded-t-lg"
                  />

                  <div className="p-3">
                    <h2 className="font-semibold text-sm mt-2">{doctor.name}</h2>

                    <p className="text-xs text-gray-600">{doctor.degree}</p>

                    <p className="text-sm text-[#FF8040] font-medium">
                      {doctor.specialization}
                    </p>

                    <p className="text-xs text-gray-500 mt-1">📍 {doctor.location}</p>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>

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
