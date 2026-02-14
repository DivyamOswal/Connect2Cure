import React, { useEffect } from "react";
import Title from "../components/Title";
import AllDoctors from "../components/Doctors/AllDoctors";
import { useTranslation } from "react-i18next";

const Doctors = () => {
  const { t } = useTranslation("finddoctors");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="bg-[#E6E6E6] px-6 py-5 md:px-16 lg:px-24 xl:px-32 overflow-hidden">
      <Title
        title={t("title", {
          defaultValue: "Find the Right Doctor for Your Healthcare Needs",
        })}
        subtitle={t("subtitle", {
          defaultValue:
            "Explore qualified specialists across multiple medical fields. Compare expertise, experience, fees, and availability to choose the best doctor for your treatment.",
        })}
      />
      <AllDoctors />
    </div>
  );
};

export default Doctors;
