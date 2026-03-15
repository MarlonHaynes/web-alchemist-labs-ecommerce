import { useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { formatCurrency } from "../utils/formatCurrency";
import { savePendingCheckout } from "../utils/checkoutStorage";
import { createCheckoutSession } from "../services/stripeService";

export default function CheckoutPage() {
  const { cartItems, cartTotal } = useCart();
  const { currentUser } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    email: currentUser?.email || "",
    addressLine1: "",
    city: "",
    province: "",
    postalCode: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const itemCount = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage("");

    const requiredFields = [
      "fullName",
      "email",
      "addressLine1",
      "city",
      "province",
      "postalCode",
    ];

    const hasEmptyField = requiredFields.some(
      (field) => !formData[field].trim()
    );

    if (hasEmptyField) {
      setErrorMessage("Please complete all checkout fields.");
      return;
    }

    const checkoutPayload = {
      customer: formData,
      items: cartItems,
      totals: {
        itemCount,
        subtotal: cartTotal,
        total: cartTotal,
      },
      createdAt: new Date().toISOString(),
    };

    try {
      setIsSubmitting(true);

      savePendingCheckout(checkoutPayload);

      const { url } = await createCheckoutSession(checkoutPayload);

      window.location.href = url;
    } catch (error) {
      setErrorMessage(error.message || "Unable to start Stripe checkout.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!cartItems.length) {
    return <Navigate to="/cart" replace />;
  }

  return (
    <div className="checkout-page">
      <div className="checkout-layout">
        <section className="checkout-form-card">
          <h1>Checkout</h1>
          <p className="checkout-subtext">
            Enter your customer and shipping details to continue to payment.
          </p>

          <form onSubmit={handleSubmit} className="checkout-form">
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="addressLine1">Address Line 1</label>
              <input
                id="addressLine1"
                name="addressLine1"
                type="text"
                value={formData.addressLine1}
                onChange={handleChange}
              />
            </div>

            <div className="checkout-grid-two">
              <div className="form-group">
                <label htmlFor="city">City</label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="province">Province</label>
                <input
                  id="province"
                  name="province"
                  type="text"
                  value={formData.province}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="postalCode">Postal Code</label>
              <input
                id="postalCode"
                name="postalCode"
                type="text"
                value={formData.postalCode}
                onChange={handleChange}
              />
            </div>

            {errorMessage ? <p className="form-error">{errorMessage}</p> : null}

            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? "Redirecting to Stripe..." : "Pay with Stripe"}
            </button>
          </form>
        </section>

        <aside className="checkout-summary-card">
          <h2>Order Summary</h2>

          <div className="checkout-summary-items">
            {cartItems.map((item) => (
              <div key={item.id} className="checkout-summary-item">
                <div>
                  <p className="checkout-item-title">{item.title}</p>
                  <p className="checkout-item-meta">
                    Qty: {item.quantity} × {formatCurrency(item.price)}
                  </p>
                </div>

                <strong>{formatCurrency(item.price * item.quantity)}</strong>
              </div>
            ))}
          </div>

          <div className="checkout-summary-totals">
            <div className="summary-row">
              <span>Items</span>
              <strong>{itemCount}</strong>
            </div>

            <div className="summary-row">
              <span>Subtotal</span>
              <strong>{formatCurrency(cartTotal)}</strong>
            </div>

            <div className="summary-row">
              <span>Total</span>
              <strong>{formatCurrency(cartTotal)}</strong>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}