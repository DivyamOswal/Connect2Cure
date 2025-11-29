// src/pages/DoctorLayout.jsx
import React, { useEffect, useMemo, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import api from "../../api/axios";

const getUserFromStorage = () => {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const DoctorLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [stats, setStats] = useState(null);       // 👈 data from backend
  const [statsError, setStatsError] = useState("");
  const location = useLocation();
  const user = getUserFromStorage();

  // fetch doctor summary from backend
  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await api.get("/dashboard/doctor/summary");
        // your controller: { stats: {...}, recentAppointments: [...] }
        setStats(res.data?.stats || null);
      } catch (err) {
        console.error("DOCTOR SUMMARY ERROR:", err);
        setStatsError(
          err?.response?.data?.message || err.message || "Failed to load summary"
        );
      }
    };

    fetchSummary();
  }, []);

  // nav items
  const navItems = useMemo(
    () => [
      { key: "overview", label: "Overview", path: "/dashboard/doctor" },
      { key: "appointments", label: "Appointments", path: "/dashboard/doctor/appointments" },
      { key: "patients", label: "Patients", path: "/dashboard/doctor/patients" },
      { key: "earnings", label: "Earnings", path: "/dashboard/doctor/earnings" },
    ],
    []
  );

  const linkClasses = ({ isActive }) =>
    `flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-sm transition ${
      isActive
        ? "bg-[#FF8040]/20 text-[#FF8040] font-semibold"
        : "text-gray-700 hover:bg-gray-100"
    }`;

  const currentSection = useMemo(() => {
    const found = navItems.find((item) => item.path === location.pathname);
    return found?.label || "Doctor Panel";
  }, [location.pathname, navItems]);

  const doctorName = user?.name || "Doctor";

  // decide which nav items get a dynamic badge
  const getBadgeValue = (key) => {
    if (!stats) return null;

    if (key === "appointments") return stats.totalAppointments ?? null;
    if (key === "messages") return stats.unreadMessages ?? null;
    // you can add more if you want
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row mt-17">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 bg-white border-r border-gray-200 p-4 flex-col">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-[#FF8040]">
            Doctor Panel
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Welcome, {doctorName}
          </p>

          {/* small stats strip under the title */}
          {stats && (
            <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
              <div className="bg-gray-50 rounded-lg px-2 py-1">
                <p className="text-gray-500">Total appts</p>
                <p className="font-semibold text-gray-800">
                  {stats.totalAppointments}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg px-2 py-1">
                <p className="text-gray-500">Upcoming</p>
                <p className="font-semibold text-gray-800">
                  {stats.upcomingAppointments}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg px-2 py-1">
                <p className="text-gray-500">Today</p>
                <p className="font-semibold text-gray-800">
                  {stats.todayAppointments}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg px-2 py-1">
                <p className="text-gray-500">Unread msgs</p>
                <p className="font-semibold text-gray-800">
                  {stats.unreadMessages}
                </p>
              </div>
            </div>
          )}

          {statsError && (
            <p className="mt-2 text-[11px] text-red-500">{statsError}</p>
          )}
        </div>

        <nav className="space-y-2 text-sm">
          {navItems.map((item) => {
            const badge = getBadgeValue(item.key);

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/dashboard/doctor"}
                className={linkClasses}
              >
                <span>{item.label}</span>
                {badge !== null && (
                  <span className="ml-auto inline-flex items-center justify-center min-w-[1.75rem] px-2 py-0.5 rounded-full bg-[#FF8040]/10 text-[11px] text-[#FF8040] font-semibold">
                    {badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Header + Menu */}
      <header className="md:hidden bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[#FF8040]">
              {currentSection}
            </h2>
            <p className="text-[11px] text-gray-500">
              {doctorName}
            </p>
          </div>

          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="inline-flex items-center justify-center rounded-md border border-gray-300 px-3 py-1 text-sm font-medium text-gray-700"
          >
            {mobileMenuOpen ? "Close" : "Menu"}
          </button>
        </div>

        {mobileMenuOpen && (
          <nav className="mt-3 space-y-1 text-sm">
            {navItems.map((item) => {
              const badge = getBadgeValue(item.key);

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/dashboard/doctor"}
                  className={linkClasses}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>{item.label}</span>
                  {badge !== null && (
                    <span className="ml-auto inline-flex items-center justify-center min-w-[1.75rem] px-2 py-0.5 rounded-full bg-[#FF8040]/10 text-[11px] text-[#FF8040] font-semibold">
                      {badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        )}
      </header>

      {/* Main area */}
      <main className="flex-1 p-4 md:p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default DoctorLayout;
