import React from "react";
import Title from "../Title";
import { useTranslation } from "react-i18next";

const Benefits = () => {
  const { t } = useTranslation("benefits");

  const benefits = [
    "faster",
    "reducedErrors",
    "secure",
    "easy"
  ];

  return (
    <div className="bg-[#E6E6E6] px-6 py-5 md:px-16 lg:px-24 xl:px-32 overflow-hidden">
      <Title
        title={t("title", { defaultValue: "Benefits" })}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
        {benefits.map((key) => (
          <div key={key} className="p-4 border rounded-lg">
            <h4 className="font-medium text-[#FF8040]">
              {t(`items.${key}.title`)}
            </h4>
            <p className="text-sm text-gray-600 mt-1">
              {t(`items.${key}.description`)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Benefits;
