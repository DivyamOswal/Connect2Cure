import React from "react";
import heroImg from "../../assets/Home/hero_img.avif";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section
      role="region"
      aria-label="Hero section"
      className="relative flex flex-col items-start justify-center h-screen text-white px-6 md:px-16 lg:px-24 xl:px-32 overflow-hidden"
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${heroImg})`,
        }}
      ></div>

      {/* Optional overlay for better text contrast */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Content */}
      <div className="relative z-10 max-w-2xl">
        <p className="bg-black/70 px-3.5 py-1 rounded-full mt-20 text-sm inline-block">
          Your Health, Simplified and Connected
        </p>

        <h1 className="font-playfair text-3xl md:text-5xl leading-tight font-medium mt-4">
          Discover a Smarter, Simpler Way to Manage Your Health
        </h1>

        <p className="max-w-md mt-3 text-sm md:text-base text-white/90">
          Access your health records, prescriptions, and doctor consultations all in one secure, easy-to-use dashboard. Take control of your healthcare journey today.
        </p>

        <Link to="/doctors">
          <button className="mt-6 inline-flex items-center gap-2 bg-black/90 text-white font-medium px-5 py-3 rounded-lg hover:bg-black/70 transition">
            <Search className="h-4 w-4" />
            <span>Explore Doctors</span>
          </button>
        </Link>
      </div>
    </section>
  );
};

export default Hero;
