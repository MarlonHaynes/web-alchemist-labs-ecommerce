import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import LoadingState from "../components/LoadingState";
import OrderHistoryList from "../components/OrderHistoryList";
import { getOrdersByUserId } from "../services/orderService";

export default function DashboardPage() {
  const { currentUser } = useAuth();

  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      if (!currentUser?.uid) {
        setOrders([]);
        setIsLoading(false);
        return;
      }

      const orderData = await getOrdersByUserId(currentUser.uid);
      setOrders(orderData);
      setIsLoading(false);
    }

    loadOrders();
  }, [currentUser]);

  if (isLoading) {
    return <LoadingState message="Loading your account..." />;
  }

  return (
    <div className="dashboard-page">
      <section className="page-section">
        <h1>My Account</h1>
        <p>Welcome to your customer dashboard.</p>

        <div className="dashboard-info-grid dashboard-summary-grid">
          <div className="info-card">
            <span className="info-label">Logged In As</span>
            <strong className="info-value">{currentUser?.email}</strong>
          </div>

          <div className="info-card">
            <span className="info-label">Completed Orders</span>
            <strong className="info-value">{orders.length}</strong>
          </div>
        </div>
      </section>

      <section className="dashboard-orders-section">
        <div className="section-heading">
          <span className="eyebrow">Order History</span>
          <h2>Your recent orders</h2>
          <p>Review completed purchases, totals, and order status updates.</p>
        </div>

        <OrderHistoryList orders={orders} />
      </section>
    </div>
  );
}