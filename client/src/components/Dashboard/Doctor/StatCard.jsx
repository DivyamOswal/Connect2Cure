// src/components/doctor/StatCard.jsx
import React from "react";

const StatCard = ({ icon: Icon, value, label }) => {
  return (
    <div className="flex items-center gap-4 bg-white p-4 min-w-58 rounded shadow cursor-pointer hover:scale-105 transition-all">
      <div className="p-3 rounded-full bg-[#FF8040]/10 flex items-center justify-center">
        <Icon className="w-6 h-6 text-[#FF8040]" />
      </div>
      <div>
        <p className="text-3xl font-semibold text-gray-700">{value}</p>
        <p className="text-gray-400 font-light">{label}</p>
      </div>
    </div>
  );
};

export default StatCard;
