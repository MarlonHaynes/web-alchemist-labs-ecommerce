import { useEffect, useMemo, useState } from "react";
import AdminStatCard from "../components/AdminStatCard";
import AdminRecentOrders from "../components/AdminRecentOrders";
import LoadingState from "../../components/LoadingState";
import { getOrders, getRecentOrders } from "../../services/orderService";
import { getLowStockProducts, getProducts } from "../../services/productService";
import { formatCurrency } from "../../utils/formatCurrency";

export default function AdminDashboardPage() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadAdminDashboardData() {
      setIsLoading(true);

      const [productsData, ordersData, recentOrdersData, lowStockData] =
        await Promise.all([
          getProducts(),
          getOrders(),
          getRecentOrders(5),
          getLowStockProducts(5),
        ]);

      setProducts(productsData);
      setOrders(ordersData);
      setRecentOrders(recentOrdersData);
      setLowStockProducts(lowStockData);
      setIsLoading(false);
    }

    loadAdminDashboardData();
  }, []);

  const totalRevenue = useMemo(() => {
    return orders.reduce((sum, order) => sum + (order.totals?.total ?? 0), 0);
  }, [orders]);

  const totalUnitsInInventory = useMemo(() => {
    return products.reduce((sum, product) => sum + (product.stock ?? 0), 0);
  }, [products]);

  if (isLoading) {
    return <LoadingState message="Loading admin dashboard..." />;
  }

  return (
    <div className="admin-dashboard-page">
      <section className="page-hero">
        <span className="eyebrow">Admin Overview</span>
        <h1>Web Alchemist Labs Ecommerce Dashboard</h1>
        <p>
          Monitor core store performance, order flow, revenue, and product
          inventory from one place.
        </p>
      </section>

      <section className="admin-stats-grid">
        <AdminStatCard
          label="Total Products"
          value={products.length}
          helperText="All products currently available in the Firestore catalog."
        />

        <AdminStatCard
          label="Total Orders"
          value={orders.length}
          helperText="Completed orders saved after successful Stripe checkout."
        />

        <AdminStatCard
          label="Total Revenue"
          value={formatCurrency(totalRevenue)}
          helperText="Combined value of all completed orders in the system."
        />

        <AdminStatCard
          label="Inventory Units"
          value={totalUnitsInInventory}
          helperText="Current stock remaining across all products."
        />
      </section>

      <section className="admin-dashboard-layout">
        <div className="admin-panel">
          <div className="admin-panel-heading">
            <div>
              <span className="eyebrow">Recent Activity</span>
              <h2>Recent Orders</h2>
            </div>
          </div>

          <AdminRecentOrders orders={recentOrders} />
        </div>

        <div className="admin-panel">
          <div className="admin-panel-heading">
            <div>
              <span className="eyebrow">Inventory Alerts</span>
              <h2>Low Stock Products</h2>
            </div>
          </div>

          {lowStockProducts.length === 0 ? (
            <div className="empty-state">
              <h3>No low stock alerts</h3>
              <p>All products are currently above the low stock threshold.</p>
            </div>
          ) : (
            <div className="admin-low-stock-list">
              {lowStockProducts.map((product) => (
                <div key={product.id} className="admin-low-stock-row">
                  <div>
                    <p className="checkout-item-title">{product.title}</p>
                    <p className="checkout-item-meta">{product.category}</p>
                  </div>

                  <span className="low-stock-count">{product.stock} left</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}