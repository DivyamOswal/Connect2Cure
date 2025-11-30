// client/src/api/billingApi.js
import api from "./axios";

// planId: "basic" | "pro" | "premium"
export const createCheckoutSession = async (planId) => {
  const res = await api.post("/billing/create-checkout-session", { planId });
  return res.data; // { url }
};

export const confirmCreditsPurchase = async (sessionId) => {
  const res = await api.post("/billing/confirm-credits", { sessionId });
  return res.data;
};

export const getMyTransactions = async () => {
  const res = await api.get("/billing/my-transactions");
  return res.data; // array of transactions
};
