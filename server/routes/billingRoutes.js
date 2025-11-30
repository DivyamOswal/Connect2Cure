// server/routes/billingRoutes.js
import express from "express";
import {
  createCheckoutSession,
  confirmCredits,
  getMyTransactions,
  handleStripeWebhook,
} from "../controllers/billingController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// create checkout session to buy credits
router.post("/create-checkout-session", auth(), createCheckoutSession);

// OPTIONAL: confirm credits via client call
router.post("/confirm-credits", auth(), confirmCredits);

// list current user's transactions
router.get("/my-transactions", auth(), getMyTransactions);

// Stripe webhook (no auth – Stripe calls this)
router.post(
  "/webhook",
  // IMPORTANT: raw body for signature verification
  express.raw({ type: "application/json" }),
  handleStripeWebhook
);

export default router;
