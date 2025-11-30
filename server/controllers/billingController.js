// server/controllers/billingController.js
import stripe from "../config/stripe.js";
import { User } from "../models/User.js";
import BillingTransaction from "../models/BillingTransaction.js";

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

// create Stripe Checkout session for credits
export const createCheckoutSession = async (req, res) => {
  try {
    const { planId } = req.body;
    const plan = PLANS[planId];

    console.log("🔥 createCheckoutSession planId =", planId);
    console.log("👉 Plan config =", plan);

    if (!plan || !plan.stripePriceId) {
      return res
        .status(400)
        .json({ message: "Invalid plan or missing Stripe price ID" });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

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
    return res.status(500).json({ message: err.message || "Stripe error" });
  }
};

// confirm credits after user returns from Stripe
export const confirmCredits = async (req, res) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId) {
      return res.status(400).json({ message: "sessionId is required" });
    }

    // retrieve session from Stripe
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

    // 1) Add credits to user
    await User.findByIdAndUpdate(userId, {
      $inc: { credits: creditsNum },
    });

    // 2) Record transaction in DB
    const amountTotal = session.amount_total ?? 0; // in smallest currency unit
    const currency = session.currency ?? "inr";

    // avoid duplicate record if confirmCredits is called twice
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
      console.log(`✅ Added ${creditsNum} credits & logged transaction for user ${userId}`);
    } else {
      console.log("ℹ️ Transaction already recorded for session", session.id);
    }

    return res.json({ success: true, addedCredits: creditsNum });
  } catch (err) {
    console.error("❌ confirmCredits error:", err);
    return res.status(500).json({ message: err.message || "Confirm error" });
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
    return res.status(500).json({ message: "Failed to load transactions" });
  }
};
