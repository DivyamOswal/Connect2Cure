// src/components/CreateBadge.jsx
import React from "react";

export default function CreateBadge({ label }) {
  return (
    <span className="px-2 py-1 text-xs rounded-full bg-[#FF8040]/80 text-black font-medium">
      {label}
    </span>
  );
}
