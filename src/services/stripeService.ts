const CHECKOUT_URL =
  process.env.NEXT_PUBLIC_CHECKOUT_URL || "/api/create-checkout-session";

function buildCheckoutUrls() {
  const urls = [CHECKOUT_URL];

  if (typeof window !== "undefined") {
    const isLocal =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";

    if (isLocal) {
      urls.push("http://localhost:3000/api/create-checkout-session");
      urls.push("http://localhost:3001/api/create-checkout-session");

      const sameHost3000 = `${window.location.protocol}//${window.location.hostname}:3000/api/create-checkout-session`;
      const sameHost3001 = `${window.location.protocol}//${window.location.hostname}:3001/api/create-checkout-session`;

      urls.push(sameHost3000, sameHost3001);
    }
  }

  return [...new Set(urls)];
}

export async function createCheckoutSession(checkoutData) {
  const payload = {
    checkoutData,
    origin: window.location.origin,
  };

  let lastError = null;

  for (const endpoint of buildCheckoutUrls()) {
    try {
      const response = await fetch(endpoint, {
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
    } catch (error) {
      lastError = error;
    }
  }

  const message = lastError?.message || "Failed to create checkout session.";

  if (
    /Failed to fetch/i.test(message) ||
    /NetworkError/i.test(message)
  ) {
    throw new Error(
      "Checkout service is unreachable. Start the app with 'npm run dev' and try again."
    );
  }

  throw new Error(message);
}