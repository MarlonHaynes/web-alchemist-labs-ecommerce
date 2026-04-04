export async function triggerOrderConfirmationEmail(payload) {
  const webhookUrl = process.env.NEXT_PUBLIC_ZAPIER_ORDER_WEBHOOK_URL;

  console.log("ZAPIER WEBHOOK URL:", webhookUrl);
  console.log("ZAPIER PAYLOAD:", payload);

  if (!webhookUrl) {
    return {
      success: false,
      skipped: true,
      message: "Zapier webhook URL is not configured.",
    };
  }

  try {
    await fetch(webhookUrl, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    console.log("ZAPIER WEBHOOK SENT");

    return {
      success: true,
      skipped: false,
      message: "Zapier webhook triggered successfully.",
    };
  } catch (error) {
    console.error("ZAPIER ERROR:", error);

    throw error;
  }
}