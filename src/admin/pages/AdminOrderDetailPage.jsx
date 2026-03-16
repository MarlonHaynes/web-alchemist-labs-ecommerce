import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import LoadingState from "../../components/LoadingState";
import { getOrderById, updateOrderStatus } from "../../services/orderService";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatOrderDate } from "../../utils/formatOrderDate";

export default function AdminOrderDetailPage() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadOrder() {
      setIsLoading(true);
      const data = await getOrderById(id);
      setOrder(data);
      setSelectedStatus(data?.orderStatus || "");
      setIsLoading(false);
    }

    loadOrder();
  }, [id]);

  async function handleStatusUpdate() {
    if (!order || !selectedStatus) {
      return;
    }

    setIsSaving(true);
    await updateOrderStatus(order.id, selectedStatus);
    setOrder((prev) => ({
      ...prev,
      orderStatus: selectedStatus,
    }));
    setIsSaving(false);
  }

  if (isLoading) {
    return <LoadingState message="Loading admin order details..." />;
  }

  if (!order) {
    return <Navigate to="/admin/orders" replace />;
  }

  return (
    <section className="page-section">
      <div className="order-detail-header">
        <div>
          <span className="order-card-label">Admin Order View</span>
          <h1 className="order-detail-title">{order.id}</h1>
        </div>

        <Link to="/admin/orders" className="btn btn-secondary">
          Back to Orders
        </Link>
      </div>

      <div className="dashboard-info-grid">
        <div className="info-card">
          <span className="info-label">Placed On</span>
          <strong className="info-value">{formatOrderDate(order.createdAt)}</strong>
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

      <div className="admin-order-status-panel">
        <div className="form-group">
          <label htmlFor="orderStatus">Update Order Status</label>
          <select
            id="orderStatus"
            value={selectedStatus}
            onChange={(event) => setSelectedStatus(event.target.value)}
          >
            <option value="processing">processing</option>
            <option value="packed">packed</option>
            <option value="shipped">shipped</option>
            <option value="delivered">delivered</option>
            <option value="cancelled">cancelled</option>
          </select>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={handleStatusUpdate}
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save Status"}
        </button>
      </div>

      <div className="order-detail-sections">
        <div className="order-detail-panel">
          <h2>Items Purchased</h2>

          <div className="order-detail-items">
            {order.items?.map((item) => (
              <div key={item.id} className="order-detail-item">
                <div>
                  <p className="checkout-item-title">{item.title}</p>
                  <p className="checkout-item-meta">
                    Product ID: {item.id} • Qty: {item.quantity} ×{" "}
                    {formatCurrency(item.price)}
                  </p>
                </div>

                <strong>{formatCurrency(item.quantity * item.price)}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="order-detail-panel">
          <h2>Customer Information</h2>

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