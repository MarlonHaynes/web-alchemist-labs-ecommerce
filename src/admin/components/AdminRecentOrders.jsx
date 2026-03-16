import { Link } from "react-router-dom";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatOrderDate } from "../../utils/formatOrderDate";

export default function AdminRecentOrders({ orders }) {
  if (!orders.length) {
    return (
      <div className="empty-state">
        <h3>No recent orders</h3>
        <p>Orders will appear here after customers complete checkout.</p>
      </div>
    );
  }

  return (
    <div className="admin-recent-orders">
      {orders.map((order) => (
        <div key={order.id} className="admin-order-row">
          <div className="admin-order-main">
            <span className="order-card-label">Order ID</span>
            <strong className="admin-order-id">{order.id}</strong>
            <p className="admin-order-meta">
              {order.customerName} • {order.customerEmail}
            </p>
          </div>

          <div className="admin-order-side">
            <p>{formatCurrency(order.totals?.total ?? 0)}</p>
            <p className="admin-order-meta">{formatOrderDate(order.createdAt)}</p>
            <Link to="/admin/orders" className="btn btn-secondary">
              Manage
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}