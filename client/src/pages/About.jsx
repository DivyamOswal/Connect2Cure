import React, { useEffect } from "react";
import img1 from "../assets/About/img-1.png";
import img2 from "../assets/About/img-2.png";
import img3 from "../assets/About/img-3.avif";

const About = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  return (
    <section className="bg-[#E6E6E6] px-6 py-12">
      <div className="max-w-[1200px] mx-auto">
        {/* Heading */}
        <h1 className="text-center text-3xl md:text-4xl font-semibold text-gray-800">
          About Us
        </h1>

        <p className="text-center text-gray-700 mt-3 text-base md:text-lg leading-relaxed">
          “Healthcare made simpler, care made smarter.” <br />
          At <span className="font-semibold text-[#222]">Connect2Cure</span>, we
          bring patients and doctors together through a seamless, secure, and
          intelligent platform designed to improve care, save time, and
          streamline every medical interaction.
        </p>

        {/* Content Section */}
        <div className="flex flex-col md:flex-row items-center gap-8 mt-12">
          <img
            src={img1}
            alt="EaseWithStay"
            className="h-[300px] md:h-[350px] w-full md:w-[500px] rounded-xl object-cover shadow-md"
          />

          <div className="flex-1 text-gray-800">
            <h3 className="text-xl font-semibold mb-3 text-[#FF8040]">
              Every consultation, a step toward better health.
            </h3>

            <p className="text-base leading-relaxed">
              At Connect2Cure, we believe healthcare should be more than just
              appointments it should be a compassionate experience. From routine
              checkups and specialist consultations to long-term treatment
              support, we connect patients with trusted, verified, and highly
              qualified doctors across all medical fields.
              <br />
              <br />
              Whether you need quick guidance, chronic care management, or
              expert medical opinions, our platform ensures easy access,
              transparent information, and a smooth, secure healthcare journey
              anytime, anywhere.
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-8 mt-20">
          <div className="flex-1 text-gray-800">
            <h3 className="text-xl font-semibold mb-3 text-[#FF8040]">
              What we offer?
            </h3>

            <p className="text-base leading-relaxed">
              🩺 <span className="font-semibold">Consultations</span> : Connect
              instantly with trusted and qualified doctors across specialties.
            </p>

            <p className="text-base leading-relaxed">
              👨‍⚕️ <span className="font-semibold">Specialist Appointments</span>{" "}
              : Book sessions with top experts including cardiologists,
              dermatologists, pediatricians, and more.
            </p>

            <p className="text-base leading-relaxed">
              📝 <span className="font-semibold">Digital Medical Records</span>{" "}
              : Securely store, track, and access prescriptions, reports, and
              history anytime.
            </p>

            <p className="text-base leading-relaxed">
              🔔 <span className="font-semibold">Health Reminders</span> :
              Automated reminders for medicines, follow-ups, and upcoming
              appointments.
            </p>
          </div>

          <img
            src={img2}
            alt="Connect2Cure Services"
            className="h-[300px] md:h-[350px] w-full md:w-[500px] rounded-xl object-cover shadow-md"
          />
        </div>

        <div className="flex flex-col md:flex-row items-center gap-8 mt-20">
          <img
            src={img3}
            alt="Connect2Cure"
            className="h-[300px] md:h-[350px] w-full md:w-[500px] rounded-xl object-cover shadow-md"
          />

          <div className="flex-1 text-gray-800">
            <h3 className="text-xl font-semibold mb-3 text-[#FF8040]">Why choose us?</h3>

            <p className="text-base leading-relaxed">
              • Verified, qualified doctors across all specialties
            </p>

            <p className="text-base leading-relaxed">
              • Transparent consultation fees with no hidden charges
            </p>

            <p className="text-base leading-relaxed">
              • Fast, secure & user-friendly appointment booking
            </p>

            <p className="text-base leading-relaxed">
              • 24×7 support to assist you with health queries and scheduling
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
