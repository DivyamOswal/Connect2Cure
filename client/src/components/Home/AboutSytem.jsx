import React from "react";
import Title from "../Title"; // <-- add Title for consistency

const AboutSystem = () => {
  return (
    <section className="bg-[#E6E6E6] px-6 py-5 md:px-16 lg:px-24 xl:px-32 overflow-hidden">
      
      <Title
        title="About the System"
        subtitle="Learn how our unified patient-management platform transforms clinic operations and improves care quality."
      />

      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-md border border-gray-100 mt-6">
        <p className="text-gray-700 leading-relaxed text-base md:text-lg">
          <strong className="text-[#FF8142]">What it is</strong> : A unified patient-management platform that
          centralizes patient records, appointments, billing, and analytics in one
          secure dashboard.
          <br /><br />
          <strong className="text-[#FF8142]">Why it was built</strong> : To eliminate fragmented paper-based
          workflows and outdated systems by offering a modern, secure, and
          user-friendly digital solution for clinics.
          <br /><br />
          <strong className="text-[#FF8142]">Problem it solves</strong> : Reduces manual effort and errors,
          improves staff productivity, and provides clinicians fast access to
          accurate patient data for better decision-making.
        </p>
      </div>
    </section>
  );
};

export default AboutSystem;
