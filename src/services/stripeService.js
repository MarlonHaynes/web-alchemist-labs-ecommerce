const CHECKOUT_URL =
  import.meta.env.VITE_CHECKOUT_URL || "/api/create-checkout-session";

export async function createCheckoutSession(checkoutData) {
  const payload = {
    checkoutData,
    origin: window.location.origin,
  };

  const response = await fetch(CHECKOUT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const text = await response.text();

  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error("Server did not return valid JSON.");
  }

  if (!response.ok) {
    throw new Error(data.error || "Failed to create checkout session.");
  }

  if (!data.url) {
    throw new Error("No checkout URL returned.");
  }

  return data.url;
}