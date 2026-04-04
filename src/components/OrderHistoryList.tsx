import OrderHistoryCard from "./OrderHistoryCard";
import EmptyState from "./EmptyState";

export default function OrderHistoryList({ orders }) {
  if (!orders.length) {
    return (
      <EmptyState
        title="No orders yet"
        description="Your completed orders will appear here after successful checkout."
      />
    );
  }

  return (
    <div className="order-history-list">
      {orders.map((order) => (
        <OrderHistoryCard key={order.id} order={order} />
      ))}
    </div>
  );
}