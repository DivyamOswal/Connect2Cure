// server/config/stripe.js
import Stripe from "stripe";

const isProd = process.env.NODE_ENV === "production";

// In .env:
// STRIPE_SECRET_KEY_TEST=sk_test_...
// STRIPE_SECRET_KEY_LIVE=sk_live_...
const stripeSecretKey = isProd
  ? process.env.STRIPE_SECRET_KEY_LIVE
  : process.env.STRIPE_SECRET_KEY_TEST || process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error("Stripe secret key is not set. Check environment variables.");
}

const stripe = new Stripe(stripeSecretKey, {
  // use whichever version your account is on
  apiVersion: "2024-06-20",
});

export default stripe;
