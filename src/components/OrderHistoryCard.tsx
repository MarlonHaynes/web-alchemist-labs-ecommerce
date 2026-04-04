import { Link } from "react-router-dom";
import { formatCurrency } from "../utils/formatCurrency";
import { formatOrderDate } from "../utils/formatOrderDate";

export default function OrderHistoryCard({ order }) {
  return (
    <article className="order-card">
      <div className="order-card-top">
        <div>
          <span className="order-card-label">Order ID</span>
          <h3 className="order-card-id">{order.id}</h3>
        </div>

        <div className="order-badges">
          <span className="order-badge payment">{order.paymentStatus}</span>
          <span className="order-badge status">{order.orderStatus}</span>
        </div>
      </div>

      <div className="order-card-grid">
        <div>
          <span className="order-card-label">Placed On</span>
          <p>{formatOrderDate(order.createdAt)}</p>
        </div>

        <div>
          <span className="order-card-label">Items</span>
          <p>{order.totals?.itemCount ?? 0}</p>
        </div>

        <div>
          <span className="order-card-label">Total</span>
          <p>{formatCurrency(order.totals?.total ?? 0)}</p>
        </div>
      </div>

      <div className="order-card-actions">
        <Link to={`/dashboard/orders/${order.id}`} className="btn btn-secondary">
          View Details
        </Link>
      </div>
    </article>
  );
}