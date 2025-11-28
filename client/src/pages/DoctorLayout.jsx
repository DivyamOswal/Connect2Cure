// src/pages/DoctorLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import DoctorSidebar from "../components/Dashboard/Doctor/DoctorSidebar";

const DoctorLayout = () => {
  return (
    <div className="flex">
      <aside
        className="
          fixed left-0 top-16 bottom-0
          w-16 sm:w-20 md:w-56 lg:w-64
          bg-white border-r
        "
      >
        <DoctorSidebar />
      </aside>
      <main
        className="
          ml-16 sm:ml-20 md:ml-56 lg:ml-64
          w-full min-h-[calc(100vh-4rem)]
          bg-[#FFF5EE] pt-6 px-3 sm:px-6 md:px-10
        "
      >
        <Outlet />
      </main>
    </div>
  );
};

export default DoctorLayout;
