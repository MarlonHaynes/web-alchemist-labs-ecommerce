import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import LoadingState from "../components/LoadingState";
import EmptyState from "../components/EmptyState";
import { useAuth } from "../context/AuthContext";
import { getOrderById } from "../services/orderService";
import { formatCurrency } from "../utils/formatCurrency";
import { formatOrderDate } from "../utils/formatOrderDate";

export default function OrderDetailPage() {
  const { id } = useParams();
  const { currentUser } = useAuth();

  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUnauthorized, setIsUnauthorized] = useState(false);

  useEffect(() => {
    async function loadOrder() {
      try {
        setIsLoading(true);

        if (!currentUser?.uid) {
          setIsUnauthorized(true);
          return;
        }

        const orderData = await getOrderById(id);

        if (!orderData) {
          setOrder(null);
          return;
        }

        if (orderData.userId !== currentUser.uid) {
          setIsUnauthorized(true);
          return;
        }

        setOrder(orderData);
      } catch (error) {
        console.error("Order detail load error:", error);
        setIsUnauthorized(true);
      } finally {
        setIsLoading(false);
      }
    }

    loadOrder();
  }, [id, currentUser]);

  if (isLoading) {
    return <LoadingState message="Loading order details..." />;
  }

  if (isUnauthorized) {
    return <Navigate to="/dashboard" replace />;
  }

  if (!order) {
    return (
      <EmptyState
        title="Order not found"
        description="The requested order could not be found."
      />
    );
  }

  return (
    <section className="page-section">
      <div className="order-detail-header">
        <div>
          <span className="order-card-label">Order ID</span>
          <h1 className="order-detail-title">{order.id}</h1>
        </div>

        <Link to="/dashboard" className="btn btn-secondary">
          Back to Dashboard
        </Link>
      </div>

      <div className="dashboard-info-grid">
        <div className="info-card">
          <span className="info-label">Placed On</span>
          <strong className="info-value">
            {formatOrderDate(order.createdAt)}
          </strong>
        </div>

        <div className="info-card">
          <span className="info-label">Payment Status</span>
          <strong className="info-value">{order.paymentStatus}</strong>
        </div>

        <div className="info-card">
          <span className="info-label">Order Status</span>
          <strong className="info-value">{order.orderStatus}</strong>
        </div>
      </div>

      <div className="order-detail-sections">
        <div className="order-detail-panel">
          <h2>Items Purchased</h2>

          <div className="order-detail-items">
            {order.items?.map((item, index) => {
              const productId = item.productId || item.id;
              const canLinkToProduct = Boolean(productId);

              const itemContent = (
                <>
                  <div className="order-detail-item-left">
                    <div className="order-detail-item-image-wrap">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="order-detail-item-image"
                        />
                      ) : (
                        <div className="order-detail-item-image-placeholder">
                          No Image
                        </div>
                      )}
                    </div>

                    <div>
                      <p className="checkout-item-title">{item.title}</p>
                      <p className="checkout-item-meta">
                        Qty: {item.quantity} × {formatCurrency(item.price)}
                      </p>
                    </div>
                  </div>

                  <strong>{formatCurrency(item.quantity * item.price)}</strong>
                </>
              );

              if (canLinkToProduct) {
                return (
                  <Link
                    key={item.productId || item.id || index}
                    to={`/products/${productId}`}
                    className="order-detail-item order-detail-item-link"
                  >
                    {itemContent}
                  </Link>
                );
              }

              return (
                <div
                  key={item.productId || item.id || index}
                  className="order-detail-item"
                >
                  {itemContent}
                </div>
              );
            })}
          </div>
        </div>

        <div className="order-detail-panel">
          <h2>Shipping Information</h2>

          <div className="order-detail-address">
            <p>{order.customerName}</p>
            <p>{order.customerEmail}</p>
            <p>{order.shippingAddress?.addressLine1}</p>
            <p>
              {order.shippingAddress?.city}, {order.shippingAddress?.province}
            </p>
            <p>{order.shippingAddress?.postalCode}</p>
          </div>

          <div className="order-detail-total-box">
            <span>Total Paid</span>
            <strong>{formatCurrency(order.totals?.total ?? 0)}</strong>
          </div>
        </div>
      </div>
    </section>
  );
}