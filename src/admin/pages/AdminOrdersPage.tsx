import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import LoadingState from "../../components/LoadingState";
import { getOrders } from "../../services/orderService";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatOrderDate } from "../../utils/formatOrderDate";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      setIsLoading(true);
      const data = await getOrders();
      setOrders(data);
      setIsLoading(false);
    }

    loadOrders();
  }, []);

  const totalRevenue = useMemo(() => {
    return orders.reduce((sum, order) => sum + (order.totals?.total ?? 0), 0);
  }, [orders]);

  if (isLoading) {
    return <LoadingState message="Loading admin orders..." />;
  }

  return (
    <div className="admin-orders-page">
      <section className="page-hero">
        <span className="eyebrow">Order Management</span>
        <h1>Manage Customer Orders</h1>
        <p>
          Review completed purchases, payment status, customer details, and
          order fulfillment state.
        </p>
      </section>

      <section className="store-summary">
        <div className="summary-card">
          <span className="summary-label">Total Orders</span>
          <strong className="summary-value">{orders.length}</strong>
        </div>

        <div className="summary-card">
          <span className="summary-label">Total Revenue</span>
          <strong className="summary-value">{formatCurrency(totalRevenue)}</strong>
        </div>

        <div className="summary-card">
          <span className="summary-label">Paid Orders</span>
          <strong className="summary-value">
            {orders.filter((order) => order.paymentStatus === "paid").length}
          </strong>
        </div>

        <div className="summary-card">
          <span className="summary-label">Processing Orders</span>
          <strong className="summary-value">
            {orders.filter((order) => order.orderStatus === "processing").length}
          </strong>
        </div>
      </section>

      <section className="admin-table-card">
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Items</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>
                    <div>
                      <strong>{order.customerName}</strong>
                      <p className="admin-order-meta">{order.customerEmail}</p>
                    </div>
                  </td>
                  <td>{formatOrderDate(order.createdAt)}</td>
                  <td>{order.totals?.itemCount ?? 0}</td>
                  <td>{formatCurrency(order.totals?.total ?? 0)}</td>
                  <td>
                    <span className="order-badge payment">
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td>
                    <span className="order-badge status">
                      {order.orderStatus}
                    </span>
                  </td>
                  <td>
                    <Link
                      to={`/admin/orders/${order.id}`}
                      className="btn btn-secondary"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}