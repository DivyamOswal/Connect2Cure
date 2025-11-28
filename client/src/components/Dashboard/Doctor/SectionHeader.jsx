// src/components/doctor/SectionHeader.jsx
import React from "react";
import clsx from "clsx";

const SectionHeader = ({ icon: Icon, title, className }) => {
  return (
    <div
      className={clsx(
        "flex items-center gap-3 text-gray-700",
        className && className
      )}
    >
      <div className="p-2 rounded-full bg-blue-50 flex items-center justify-center">
        <Icon className="w-5 h-5 text-[#FF8040]" />
      </div>
      <p className="font-medium">{title}</p>
    </div>
  );
};

export default SectionHeader;
