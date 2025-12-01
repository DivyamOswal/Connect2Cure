// server/config/stripe.js
import Stripe from "stripe";

// Try live first, then test, then generic STRIPE_SECRET_KEY
const stripeSecretKey =
  process.env.STRIPE_SECRET_KEY_LIVE ||
  process.env.STRIPE_SECRET_KEY_TEST ||
  process.env.STRIPE_SECRET_KEY;

console.log("🔑 [stripe.js] STRIPE_SECRET_KEY present?", !!stripeSecretKey);
if (stripeSecretKey) {
  console.log(
    "🔑 [stripe.js] STRIPE_SECRET_KEY starts with:",
    stripeSecretKey.slice(0, 8) + "..."
  );
}

if (!stripeSecretKey) {
  throw new Error(
    "Stripe secret key is not set. Check STRIPE_SECRET_KEY(_TEST/_LIVE) env vars."
  );
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2024-06-20",
});

export default stripe;
