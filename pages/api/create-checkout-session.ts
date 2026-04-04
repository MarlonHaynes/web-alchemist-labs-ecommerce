import Stripe from "stripe";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    return res.status(500).json({
      error: "Missing STRIPE_SECRET_KEY in server environment",
    });
  }

  const stripe = new Stripe(secretKey);

  try {
    const { checkoutData, origin } = req.body;

    if (!checkoutData || !checkoutData.items || !checkoutData.customer) {
      return res.status(400).json({ error: "Missing checkout data" });
    }

    const line_items = checkoutData.items.map((item: any) => ({
      price_data: {
        currency: "cad",
        product_data: {
          name: item.title,
          images: item.image ? [item.image] : [],
          metadata: {
            productId: item.id,
            category: item.category || "",
          },
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: checkoutData.customer.email,
      line_items,
      success_url: `${origin}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout`,
      metadata: {
        fullName: checkoutData.customer.fullName,
        email: checkoutData.customer.email,
        addressLine1: checkoutData.customer.addressLine1,
        city: checkoutData.customer.city,
        province: checkoutData.customer.province,
        postalCode: checkoutData.customer.postalCode,
      },
    });

    return res.status(200).json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe checkout session error:", error);
    return res.status(500).json({
      error: error.message || "Failed to create Stripe Checkout session",
    });
  }
}