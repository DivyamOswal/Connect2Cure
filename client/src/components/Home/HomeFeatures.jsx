import React, { useState, useEffect } from "react";
import Title from "../Title";
import featuresData from "../../assets/Features/features";
import { Link } from "react-router-dom";

const HomeFeatures = () => {
  const [itemsToShow, setItemsToShow] = useState(2);

  useEffect(() => {
    const updateSize = () => {
      if (window.innerWidth >= 1024) {
        setItemsToShow(4); // laptop and above
      } else {
        setItemsToShow(2); // mobile & tablet
      }
    };

    // run once on mount
    updateSize();

    // listen for resize
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <div className="bg-[#E6E6E6] px-6 py-5 md:px-16 lg:px-24 xl:px-32 overflow-hidden">
      <Title
        title="Everything You Need in One Healthcare Platform"
        subtitle="Manage patients, appointments, billing, and records seamlessly with our secure and intuitive system."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 py-4">
        {featuresData.slice(0, itemsToShow).map((feature) => (
          <div
            key={feature.id}
            className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100"
          >
            {/* Icon hidden on very small screens, shown from md upwards */}
            <div className="text-2xl mb-4 hidden md:block">{feature.icon}</div>

            <h3 className="text-xl font-semibold mb-2 text-gray-800">
              {feature.title}
            </h3>
            <p className="text-gray-600 text-sm">{feature.description}</p>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center pt-7">
        <Link to='/features'>
        <button className="border px-6 py-2 rounded hover:border-[#FF8040] hover:bg-white transition-colors">More Features</button>
        </Link>
      </div>
    </div>
  );
};

export default HomeFeatures;
