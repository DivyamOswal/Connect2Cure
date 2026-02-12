// src/components/Home/Dashboard.jsx
import React from "react";
import Title from "../Title";
import dashboardimg from "../../assets/Home/doctorDashboard.png";
import { useTranslation } from "react-i18next";

const Dashboard = () => {
  const { t } = useTranslation("dashboard");

  return (
    <div className="bg-[#E6E6E6] px-6 py-8 md:px-16 lg:px-24 xl:px-32 overflow-hidden">
      <Title
        title={t("title", {
          defaultValue: "Dashboard Overview",
        })}
        subtitle={t("subtitle", {
          defaultValue: "Manage your data and insights in one place.",
        })}
      />

      <div className="flex justify-center mt-6">
        <img
          src={dashboardimg}
          alt={t("imageAlt", { defaultValue: "Dashboard Overview" })}
          className="
            w-full
            max-w-5xl
            rounded-xl
            shadow-lg
            object-cover
            mx-auto
          "
        />
      </div>
    </div>
  );
};

export default Dashboard;
