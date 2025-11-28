import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarPlus,
  Users,
  FileText,
  MessageCircle,
} from "lucide-react";

const baseItemClasses =
  "flex items-center gap-3 rounded-md py-2.5 px-3 sm:px-4 md:px-6 lg:px-9 cursor-pointer hover:bg-[#FFF1E6] transition-colors text-sm sm:text-base";

const DoctorSidebar = () => {
  return (
    <div
      className="
        flex flex-col
        h-full min-h-full
        border-r border-gray-200
        bg-white
        pt-4 md:pt-6
        px-2 sm:px-3
        overflow-y-auto
      "
    >
      {/* Dashboard */}
      <NavLink end to="/dashboard/doctor" className={baseItemClasses}>
        <LayoutDashboard className="min-w-4 w-5 h-5 text-gray-700" />
        <p className="hidden md:inline-block">Dashboard</p>
      </NavLink>

      {/* Appointments */}
      <NavLink to="/dashboard/doctor/appointments" className={baseItemClasses}>
        <CalendarPlus className="min-w-4 w-5 h-5 text-gray-700" />
        <p className="hidden md:inline-block">Appointments</p>
      </NavLink>

      {/* Patients */}
      <NavLink to="/dashboard/doctor/patients" className={baseItemClasses}>
        <Users className="min-w-4 w-5 h-5 text-gray-700" />
        <p className="hidden md:inline-block">Patients</p>
      </NavLink>

      {/* Reports */}
      <NavLink to="/dashboard/doctor/reports" className={baseItemClasses}>
        <FileText className="min-w-4 w-5 h-5 text-gray-700" />
        <p className="hidden md:inline-block">Reports</p>
      </NavLink>

      {/* Messages */}
      <NavLink to="/dashboard/doctor/messages" className={baseItemClasses}>
        <MessageCircle className="min-w-4 w-5 h-5 text-gray-700" />
        <p className="hidden md:inline-block">Messages</p>
      </NavLink>
    </div>
  );
};

export default DoctorSidebar;
