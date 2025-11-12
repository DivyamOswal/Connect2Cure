import React from "react";
import Title from "../Title";
import featuresData from "../../assets/Features/features";

const FeaturesPage = () => {
  return (
    <div className="bg-[#E6E6E6] px-6 py-5 md:px-16 lg:px-24 xl:px-32 overflow-hidden">
      <Title
        title="All-in-One Patient Management Solution"
        subtitle=" Streamline your clinic operations and enhance patient care with our
          intelligent, secure, and user-friendly platform."
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 py-4">
        {featuresData.map((feature) => (
          <div
            key={feature.id}
            className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100"
          >
            <div className="text-2xl mb-4 hidden lg:block md:block">{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">
              {feature.title}
            </h3>
            <p className="text-gray-600 text-sm">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturesPage;
