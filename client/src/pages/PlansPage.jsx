// src/pages/PlansPage.jsx
import React from "react";
import { useTranslation } from "react-i18next";
import { createCheckoutSession } from "../api/billingApi";

// 🔥 ADD BASE PRICES (must match backend Stripe prices)
const PLANS = [
  { id: "basic", credits: 10, price: 199 },
  { id: "pro", credits: 50, price: 799 },
  { id: "premium", credits: 200, price: 1999 },
];

// 🔥 PRICE CALCULATION
const calculatePrice = (base) => {
  const gst = Math.round(base * 0.18);
  const platform = Math.round(base * 0.01);
  const total = base + gst + platform;

  return { base, gst, platform, total };
};

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
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-center mb-6">
        {t("title")}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PLANS.map((plan) => {
          const { base, gst, platform, total } =
            calculatePrice(plan.price);

          return (
            <div
              key={plan.id}
              className="p-6 border rounded-xl bg-white shadow flex flex-col"
            >
              <h2 className="text-xl font-semibold">
                {t(`plans.${plan.id}.name`)}
              </h2>

              {/* 🔥 TOTAL PRICE (MAIN DISPLAY) */}
              <p className="text-3xl font-bold my-3">
                ₹{total}
              </p>

              {/* 🔥 BREAKDOWN */}
              <div className="text-sm text-gray-600 space-y-1 mb-4">
                <div className="flex justify-between">
                  <span>Base Price</span>
                  <span>₹{base}</span>
                </div>

                <div className="flex justify-between">
                  <span>GST (18%)</span>
                  <span>₹{gst}</span>
                </div>

                <div className="flex justify-between">
                  <span>Platform Fee (1%)</span>
                  <span>₹{platform}</span>
                </div>

                <div className="flex justify-between font-semibold border-t pt-2">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>

              {/* 🔥 CREDIT INFO */}
              <p className="mb-4 text-gray-700">
                {t("creditsLabel", { count: plan.credits })}
              </p>

              {/* 🔥 GST LABEL */}
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded mb-3 inline-block">
                Inclusive of GST
              </span>

              <button
                onClick={() => buyPlan(plan.id)}
                className="mt-auto px-4 py-2 rounded-md bg-[#FF8040]/90 text-white shadow hover:bg-[#FF8040]"
              >
                {t("buyNow")}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}