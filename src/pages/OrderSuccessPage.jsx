import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getApp } from "firebase/app";
import { doc, getFirestore, runTransaction } from "firebase/firestore";
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
      if (processedRef.current) {
        return;
      }

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
        const existingOrder = await getOrderByStripeSessionId(
          sessionId,
          currentUser.uid
        );

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

        const db = getFirestore(getApp());

        await runTransaction(db, async (transaction) => {
          for (const item of pendingCheckout.items) {
            const productRef = doc(db, "products", item.id);
            const productSnap = await transaction.get(productRef);

            if (!productSnap.exists()) {
              throw new Error(`Product not found: ${item.id}`);
            }

            const productData = productSnap.data();
            const currentStock = productData.stock ?? 0;
            const requestedQuantity = item.quantity ?? 0;

            if (requestedQuantity <= 0) {
              throw new Error(`Invalid quantity for product: ${item.id}`);
            }

            if (currentStock < requestedQuantity) {
              throw new Error(
                `Not enough stock for ${item.name}. Available: ${currentStock}, requested: ${requestedQuantity}.`
              );
            }

            transaction.update(productRef, {
              stock: currentStock - requestedQuantity,
            });
          }
        });

        const orderPayload = {
          userId: currentUser.uid,
          customerEmail: pendingCheckout.customer.email,
          customerName: pendingCheckout.customer.fullName,
          shippingAddress: {
            addressLine1: pendingCheckout.customer.addressLine1,
            city: pendingCheckout.customer.city,
            province: pendingCheckout.customer.province,
            postalCode: pendingCheckout.customer.postalCode,
          },
          items: pendingCheckout.items,
          totals: pendingCheckout.totals,
          paymentStatus: "paid",
          orderStatus: "processing",
          stripeSessionId: sessionId,
        };

        const newOrderId = await createOrder(orderPayload);

        setSavedOrderId(newOrderId);
        setSuccessOrder({
          id: newOrderId,
          ...orderPayload,
        });
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
    <section className="page-section">
      <h1>Payment Successful</h1>
      <p>
        Your Stripe test payment was completed and your order has been saved to
        Firestore successfully.
      </p>

      <div className="dashboard-info-grid">
        <div className="info-card">
          <span className="info-label">Order ID</span>
          <strong className="info-value">{savedOrderId}</strong>
        </div>

        <div className="info-card">
          <span className="info-label">Stripe Session ID</span>
          <strong className="info-value">{sessionId}</strong>
        </div>

        <div className="info-card">
          <span className="info-label">Customer</span>
          <strong className="info-value">
            {successOrder?.customerName || "Not available"}
          </strong>
        </div>

        <div className="info-card">
          <span className="info-label">Email</span>
          <strong className="info-value">
            {successOrder?.customerEmail || "Not available"}
          </strong>
        </div>

        <div className="info-card">
          <span className="info-label">Total</span>
          <strong className="info-value">
            {formatCurrency(successOrder?.totals?.total || 0)}
          </strong>
        </div>

        <div className="info-card">
          <span className="info-label">Payment Status</span>
          <strong className="info-value">
            {successOrder?.paymentStatus === "paid" ? "Paid" : "Not available"}
          </strong>
        </div>
      </div>

      <div className="success-actions">
        <Link to="/dashboard" className="btn btn-primary">
          View My Account
        </Link>

        <Link to="/products" className="btn btn-secondary">
          Continue Shopping
        </Link>
      </div>
    </section>
  );
}