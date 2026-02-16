// src/pages/PlansPage.jsx
import React from "react";
import { useTranslation } from "react-i18next";
import { createCheckoutSession } from "../api/billingApi";

const PLANS = [
  { id: "basic", credits: 10 },
  { id: "pro", credits: 50 },
  { id: "premium", credits: 200 },
];

export default function PlansPage() {
  const { t } = useTranslation("plans");

  const buyPlan = async (planId) => {
    try {
      const { url } = await createCheckoutSession(planId);
      window.location.href = url;
    } catch (err) {
      alert(err.response?.data?.message || t("error"));
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-center mb-6">
        {t("title")}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className="p-6 border rounded-xl bg-white shadow flex flex-col"
          >
            <h2 className="text-xl font-semibold">
              {t(`plans.${plan.id}.name`)}
            </h2>

            <p className="text-3xl font-bold my-3">
              {t(`plans.${plan.id}.price`)}
            </p>

            <p className="mb-4 text-gray-700">
              {t("creditsLabel", { count: plan.credits })}
            </p>

            <button
              onClick={() => buyPlan(plan.id)}
              className="mt-auto px-4 py-2 rounded-md bg-[#FF8040]/90 text-white shadow hover:bg-[#FF8040]"
            >
              {t("buyNow")}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
