import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import LoadingState from "../components/LoadingState";
import {
  createOrder,
  getOrderByStripeSessionId,
} from "../services/orderService";
import { formatCurrency } from "../utils/formatCurrency";
import {
  clearPendingCheckout,
  getPendingCheckout,
  saveLastCompletedOrderId,
} from "../utils/checkoutStorage";

export default function OrderSuccessPage() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const { currentUser } = useAuth();
  const { clearCart } = useCart();

  const [isLoading, setIsLoading] = useState(true);
  const [savedOrderId, setSavedOrderId] = useState(null);
  const [successOrder, setSuccessOrder] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const processedRef = useRef(false);
  const pendingCheckoutRef = useRef(getPendingCheckout());

  useEffect(() => {
    async function saveCompletedOrder() {
      if (processedRef.current) return;

      if (!sessionId) {
        setErrorMessage("Missing Stripe session ID.");
        setIsLoading(false);
        return;
      }

      if (!currentUser) {
        return;
      }

      processedRef.current = true;

      try {
        const existingOrder = await getOrderByStripeSessionId(sessionId);

        if (existingOrder) {
          setSavedOrderId(existingOrder.id);
          setSuccessOrder(existingOrder);
          saveLastCompletedOrderId(existingOrder.id);
          clearPendingCheckout();
          clearCart();
          setIsLoading(false);
          return;
        }

        const pendingCheckout = pendingCheckoutRef.current;

        if (!pendingCheckout) {
          setErrorMessage("No pending checkout data was found.");
          setIsLoading(false);
          return;
        }

        const orderPayload = {
          userId: currentUser.uid,
          customerEmail: pendingCheckout.customer?.email || currentUser.email || "",
          customerName:
            pendingCheckout.customer?.fullName ||
            currentUser.displayName ||
            "Customer",
          shippingAddress: {
            addressLine1: pendingCheckout.customer?.addressLine1 || "",
            city: pendingCheckout.customer?.city || "",
            province: pendingCheckout.customer?.province || "",
            postalCode: pendingCheckout.customer?.postalCode || "",
          },
          items: pendingCheckout.items || [],
          totals: pendingCheckout.totals || {
            subtotal: 0,
            shipping: 0,
            tax: 0,
            total: 0,
          },
          paymentStatus: "paid",
          orderStatus: "processing",
          stripeSessionId: sessionId,
          automation: {
            emailConfirmationStatus: "pending",
            message: "Order saved successfully.",
          },
        };

        const newOrderId = await createOrder(orderPayload);

        const newSuccessOrder = {
          id: newOrderId,
          ...orderPayload,
        };

        setSavedOrderId(newOrderId);
        setSuccessOrder(newSuccessOrder);

        saveLastCompletedOrderId(newOrderId);
        clearPendingCheckout();
        clearCart();
      } catch (error) {
        console.error("Firestore save error:", error);
        setErrorMessage(error?.message || "Failed to save order to Firestore.");
      } finally {
        setIsLoading(false);
      }
    }

    saveCompletedOrder();
  }, [sessionId, currentUser, clearCart]);

  if (isLoading) {
    return <LoadingState message="Saving order to database..." />;
  }

  if (errorMessage) {
    return (
      <section className="page-section">
        <h1>Order Save Failed</h1>
        <p>{errorMessage}</p>
        <Link to="/products" className="btn btn-primary">
          Return to Shop
        </Link>
      </section>
    );
  }

  return (
    <section className="page-section order-success-page">
      <div className="order-success-card">
        <div className="order-success-header">
          <span className="order-badge payment order-success-badge">Success</span>
          <span className="eyebrow order-success-eyebrow">Order confirmed</span>
          <h1>Payment Successful</h1>
          <p className="order-success-description">
            Your payment was successful and your order has been received.
          </p>
        </div>

        <div className="order-success-grid">
          <div className="info-card order-success-panel">
            <span className="info-label order-success-panel-title">Confirmation Summary</span>
            <div className="order-success-meta-list">
              <div className="summary-row order-success-meta-item">
                <span className="order-success-meta-label">Order ID</span>
                <strong className="order-success-meta-value">{savedOrderId || "Not available"}</strong>
              </div>
              <div className="summary-row order-success-meta-item">
                <span className="order-success-meta-label">Total</span>
                <strong className="order-success-meta-value">{formatCurrency(successOrder?.totals?.total || 0)}</strong>
              </div>
              <div className="summary-row order-success-meta-item">
                <span className="order-success-meta-label">Payment Status</span>
                <strong className="order-success-meta-value">
                  {successOrder?.paymentStatus === "paid" ? "Paid" : "Not available"}
                </strong>
              </div>
            </div>
          </div>

          <div className="info-card order-success-panel">
            <span className="info-label order-success-panel-title">Customer Details</span>
            <div className="order-success-meta-list">
              <div className="order-success-meta-item">
                <span className="order-success-meta-label">Customer</span>
                <strong className="order-success-meta-value">{successOrder?.customerName || "Not available"}</strong>
              </div>
              <div className="order-success-meta-item">
                <span className="order-success-meta-label">Email</span>
                <strong className="order-success-meta-value">{successOrder?.customerEmail || "Not available"}</strong>
              </div>
              <div className="order-success-meta-item">
                <span className="order-success-meta-label">Shipping Address</span>
                <p className="order-success-meta-value">
                  {[
                    successOrder?.shippingAddress?.addressLine1,
                    successOrder?.shippingAddress?.city,
                    successOrder?.shippingAddress?.province,
                    successOrder?.shippingAddress?.postalCode,
                  ]
                    .filter(Boolean)
                    .join(", ") || "Not available"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="order-success-actions">
          <Link to="/dashboard" className="btn btn-primary">
            View My Account
          </Link>

          <Link to="/products" className="btn btn-secondary">
            Continue Shopping
          </Link>
        </div>
      </div>
    </section>
  );
}