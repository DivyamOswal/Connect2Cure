import React from "react";
import Title from "../Title";

const Benefits = () => {
  const benefits = [
    "Faster record management",
    "Reduced manual errors",
    "Secure and reliable",
    "Easy to use",
  ];
  return (
    <div className="bg-[#E6E6E6] px-6 py-5 md:px-16 lg:px-24 xl:px-32 overflow-hidden">
      <Title title="Benefits" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
        {benefits.map((b, idx) => (
          <div key={idx} className="p-4 border rounded-lg">
            <h4 className="font-medium text-[#FF8040]">{b}</h4>
            <p className="text-sm text-gray-600 mt-1">
              {/* short explanatory sentence — keep for black-book */}
              {b === "Faster record management" &&
                "Quickly create, find, and update patient records in a few clicks."}
              {b === "Reduced manual errors" &&
                "Structured forms and validations reduce data entry mistakes."}
              {b === "Secure and reliable" &&
                "Encrypted storage and role-based access protect sensitive data."}
              {b === "Easy to use" &&
                "A clean interface designed for medical staff with minimal training."}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Benefits;
