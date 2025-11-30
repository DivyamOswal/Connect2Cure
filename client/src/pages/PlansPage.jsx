// src/pages/PlansPage.jsx
import React from "react";
import { createCheckoutSession } from "../api/billingApi";

const PLANS = [
  { id: "basic", name: "Basic", credits: 10, price: "₹199" },
  { id: "pro", name: "Pro", credits: 50, price: "₹599" },
  { id: "premium", name: "Premium", credits: 200, price: "₹1499" },
];

export default function PlansPage() {
  const buyPlan = async (planId) => {
    try {
      const { url } = await createCheckoutSession(planId);
      window.location.href = url; // redirect to Stripe Checkout
    } catch (err) {
      alert(err.response?.data?.message || "Could not start checkout.");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-center mb-6">Choose a Plan</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className="p-6 border rounded-xl bg-white shadow flex flex-col"
          >
            <h2 className="text-xl font-semibold">{plan.name}</h2>
            <p className="text-3xl font-bold my-3">{plan.price}</p>
            <p className="mb-4 text-gray-700">
              {plan.credits} Summary Credits
            </p>

            <button
              onClick={() => buyPlan(plan.id)}
              className="mt-auto px-4 py-2 rounded-md bg-[#FF8040]/90 text-white shadow hover:bg-[#FF8040]"
            >
              Buy Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
