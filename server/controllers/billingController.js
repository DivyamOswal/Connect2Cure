// server/controllers/billingController.js
import stripe from "../config/stripe.js";
import { User } from "../models/User.js";
import BillingTransaction from "../models/BillingTransaction.js";

const isProd = process.env.NODE_ENV === "production";

const PLANS = {
  basic: {
    stripePriceId: process.env.STRIPE_PRICE_BASIC,
    credits: 10,
  },
  pro: {
    stripePriceId: process.env.STRIPE_PRICE_PRO,
    credits: 50,
  },
  premium: {
    stripePriceId: process.env.STRIPE_PRICE_PREMIUM,
    credits: 200,
  },
};

const log = (...args) => {
  if (!isProd) console.log(...args);
};

// create Stripe Checkout session for credits
export const createCheckoutSession = async (req, res) => {
  try {
    const { planId } = req.body;
    const plan = PLANS[planId];

    log("🔥 createCheckoutSession planId =", planId);
    log("👉 Plan config =", plan);

    if (!plan || !plan.stripePriceId) {
      return res
        .status(400)
        .json({ message: "Invalid plan selected" });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const clientUrl =
      process.env.CLIENT_URL ||
      (isProd ? "https://your-production-frontend.com" : "http://localhost:5173");

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price: plan.stripePriceId,
          quantity: 1,
        },
      ],
      customer_email: user.email,
      success_url: `${clientUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}&type=credits`,
      cancel_url: `${clientUrl}/payment-cancelled`,
      metadata: {
        userId: user._id.toString(),
        planId,
        credits: plan.credits.toString(),
        type: "credits",
      },
    });

    return res.json({ url: session.url });
  } catch (err) {
    console.error("❌ createCheckoutSession error:", err);
    return res.status(500).json({
      message: isProd ? "Failed to create payment session" : err.message,
    });
  }
};

// OPTIONAL: confirm credits by sessionId (client-side call)
// In production, prefer the webhook below.
export const confirmCredits = async (req, res) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId) {
      return res.status(400).json({ message: "sessionId is required" });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (session.payment_status !== "paid") {
      return res.status(400).json({ message: "Payment not completed" });
    }

    const { userId, credits, type, planId } = session.metadata || {};

    if (type !== "credits") {
      return res.status(400).json({ message: "Not a credits session" });
    }

    const creditsNum = parseInt(credits, 10) || 0;
    if (!userId || creditsNum <= 0) {
      return res.status(400).json({ message: "Invalid metadata" });
    }

    await applyCreditsAndLogTransaction({
      userId,
      session,
      creditsNum,
      planId,
    });

    return res.json({ success: true, addedCredits: creditsNum });
  } catch (err) {
    console.error("❌ confirmCredits error:", err);
    return res.status(500).json({
      message: isProd ? "Failed to confirm payment" : err.message,
    });
  }
};

// REUSABLE helper
const applyCreditsAndLogTransaction = async ({
  userId,
  session,
  creditsNum,
  planId,
}) => {
  // 1) Add credits to user
  await User.findByIdAndUpdate(userId, {
    $inc: { credits: creditsNum },
  });

  const amountTotal = session.amount_total ?? 0; // smallest currency unit
  const currency = session.currency ?? "inr";

  // 2) Avoid duplicates (webhook can retry)
  const existing = await BillingTransaction.findOne({
    stripeSessionId: session.id,
  });

  if (!existing) {
    await BillingTransaction.create({
      user: userId,
      stripeSessionId: session.id,
      planId: planId || "unknown",
      credits: creditsNum,
      amount: amountTotal,
      currency,
      status: session.payment_status,
    });
    console.log(
      `✅ Added ${creditsNum} credits & logged transaction for user ${userId}`
    );
  } else {
    console.log("ℹ️ Transaction already recorded for session", session.id);
  }
};

// PRODUCTION: Stripe webhook for automatic confirmation
// Set STRIPE_WEBHOOK_SECRET in your .env (live & test).
export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("❌ STRIPE_WEBHOOK_SECRET not set");
    return res.status(500).send("Webhook secret not configured");
  }

  let event;

  try {
    // req.rawBody must be the raw buffer (see server setup below)
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      const { userId, credits, type, planId } = session.metadata || {};
      const creditsNum = parseInt(credits || "0", 10);

      if (type === "credits" && userId && creditsNum > 0) {
        await applyCreditsAndLogTransaction({
          userId,
          session,
          creditsNum,
          planId,
        });
      }
    }

    res.json({ received: true });
  } catch (err) {
    console.error("❌ Error processing webhook event:", err);
    return res.status(500).send("Webhook handler error");
  }
};

// list current user's billing transactions
export const getMyTransactions = async (req, res) => {
  try {
    const userId = req.user.userId;

    const txs = await BillingTransaction.find({ user: userId })
      .sort({ createdAt: -1 })
      .lean();

    return res.json(txs);
  } catch (err) {
    console.error("❌ getMyTransactions error:", err);
    return res
      .status(500)
      .json({ message: "Failed to load transactions" });
  }
};
