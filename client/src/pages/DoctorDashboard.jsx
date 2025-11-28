import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAppContext } from "../context/AppContext";

import {
  Users,
  CalendarCheck,
  FileWarning,
  Stethoscope,
  MoreVertical,
  PhoneCall,
  BadgeCheck,
  XCircle,
  Clock,
} from "lucide-react";

const statusConfig = {
  completed: {
    label: "Completed",
    icon: BadgeCheck,
    className: "text-green-600 bg-green-50",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    className: "text-red-600 bg-red-50",
  },
  pending: {
    label: "Pending",
    icon: Clock,
    className: "text-amber-600 bg-amber-50",
  },
};

const DoctorDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    patients: 0,
    appointments: 0,
    pendingReports: 0,
    recentAppointments: [],
  });

  const { axios } = useAppContext();

  const fetchDashboard = async () => {
    try {
      const { data } = await axios.get("/api/doctor/dashboard");
      if (data.success) {
        setDashboardData(data.dashboardData);
      } else {
        toast.error(data.message || "Failed to load dashboard");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    }
  };

  useEffect(() => {
    setDashboardData({
      patients: 24,
      appointments: 7,
      pendingReports: 3,
      recentAppointments: [
        {
          _id: "1",
          patientName: "John Doe",
          date: new Date().toISOString(),
          status: "completed",
          type: "Online",
        },
        {
          _id: "2",
          patientName: "Ava Carter",
          date: new Date().toISOString(),
          status: "pending",
          type: "In-person",
        },
      ],
    });
  }, []);

  return (
    <div className="flex-1 bg-[#FFF5EE] px-3 py-4 sm:px-4 md:px-10 md:py-8 mt-4 md:mt-5">
      {/* TOP CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
        {/* Patients */}
        <div className="flex items-center gap-4 bg-white p-4 sm:p-5 rounded shadow cursor-pointer hover:scale-[1.02] md:hover:scale-105 transition-transform">
          <div className="p-3 rounded-full bg-[#FF80401A] flex items-center justify-center">
            <Users className="w-6 h-6 text-[#FF8040]" />
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-semibold text-gray-600">
              {dashboardData.patients}
            </p>
            <p className="text-gray-400 text-sm sm:text-base font-light">
              Patients
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-white p-4 sm:p-5 rounded shadow cursor-pointer hover:scale-[1.02] md:hover:scale-105 transition-transform">
          <div className="p-3 rounded-full bg-[#FF80401A] flex items-center justify-center">
            <CalendarCheck className="w-6 h-6 text-[#FF8040]" />
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-semibold text-gray-600">
              {dashboardData.appointments}
            </p>
            <p className="text-gray-400 text-sm sm:text-base font-light">
              Today&apos;s Appointments
            </p>
          </div>
        </div>

        {/* Pending Reports */}
        <div className="flex items-center gap-4 bg-white p-4 sm:p-5 rounded shadow cursor-pointer hover:scale-[1.02] md:hover:scale-105 transition-transform">
          <div className="p-3 rounded-full bg-[#FF80401A] flex items-center justify-center">
            <FileWarning className="w-6 h-6 text-[#FF8040]" />
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-semibold text-gray-600">
              {dashboardData.pendingReports}
            </p>
            <p className="text-gray-400 text-sm sm:text-base font-light">
              Pending Reports
            </p>
          </div>
        </div>
      </div>

      {/* RECENT APPOINTMENTS */}
      <div>
        <div className="flex items-center gap-3 mb-3 sm:mb-4 text-gray-600 px-1 sm:px-2">
          <div className="p-2 rounded-full bg-[#FF80401A] flex items-center justify-center">
            <Stethoscope className="w-5 h-5 text-[#FF8040]" />
          </div>
          <p className="text-base sm:text-lg font-medium">Recent Appointments</p>
        </div>

        <div className="relative w-full max-w-5xl mx-auto overflow-x-auto shadow rounded-lg bg-white">
          <table className="w-full text-xs sm:text-sm text-gray-500">
            <thead className="text-[11px] sm:text-xs text-gray-600 text-left uppercase">
              <tr>
                <th scope="col" className="px-2 sm:px-3 md:px-4 py-3 md:py-4">
                  #
                </th>
                <th scope="col" className="px-2 sm:px-3 md:px-4 py-3 md:py-4">
                  Patient
                </th>
                <th
                  scope="col"
                  className="px-2 sm:px-3 md:px-4 py-3 md:py-4 hidden sm:table-cell"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-2 sm:px-3 md:px-4 py-3 md:py-4 hidden md:table-cell"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-2 sm:px-3 md:px-4 py-3 md:py-4 hidden md:table-cell"
                >
                  Type
                </th>
                <th
                  scope="col"
                  className="px-2 sm:px-3 md:px-4 py-3 md:py-4 text-right"
                >
                  <MoreVertical className="w-4 h-4 inline" />
                </th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.recentAppointments.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-6 text-center text-gray-400 text-xs sm:text-sm"
                  >
                    No recent appointments
                  </td>
                </tr>
              ) : (
                dashboardData.recentAppointments.map((appt, index) => {
                  const statusKey = appt.status?.toLowerCase() || "pending";
                  const info = statusConfig[statusKey] || statusConfig.pending;
                  const StatusIcon = info.icon;

                  return (
                    <tr
                      key={appt._id}
                      className="border-t hover:bg-gray-50/60"
                    >
                      <td className="px-2 sm:px-3 md:px-4 py-3 md:py-4 text-[11px] sm:text-xs whitespace-nowrap">
                        {index + 1}
                      </td>
                      <td className="px-2 sm:px-3 md:px-4 py-3 md:py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-700 text-xs sm:text-sm">
                            {appt.patientName}
                          </span>
                        </div>
                      </td>
                      <td className="px-2 sm:px-3 md:px-4 py-3 md:py-4 hidden sm:table-cell text-[11px] sm:text-xs text-gray-500">
                        {new Date(appt.date).toLocaleString()}
                      </td>
                      <td className="px-2 sm:px-3 md:px-4 py-3 md:py-4 hidden md:table-cell">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] sm:text-[11px] font-medium ${info.className}`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {info.label}
                        </span>
                      </td>
                      <td className="px-2 sm:px-3 md:px-4 py-3 md:py-4 hidden md:table-cell text-[11px] sm:text-xs text-gray-500">
                        <span className="inline-flex items-center gap-1">
                          <PhoneCall className="w-3 h-3" />
                          {appt.type}
                        </span>
                      </td>
                      <td className="px-2 sm:px-3 md:px-4 py-3 md:py-4 text-right">
                        <button className="text-[11px] sm:text-xs text-[#FF8040] hover:underline">
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
