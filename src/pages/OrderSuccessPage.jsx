import { Link, useSearchParams } from "react-router-dom";
import { getPendingCheckout } from "../utils/checkoutStorage";
import { formatCurrency } from "../utils/formatCurrency";

export default function OrderSuccessPage() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const pendingCheckout = getPendingCheckout();

  if (!pendingCheckout) {
    return (
      <section className="page-section">
        <h1>No Checkout Session Found</h1>
        <p>There is no pending checkout data available.</p>
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
        Your Stripe test payment was completed and the customer was redirected
        back to the application successfully.
      </p>

      <div className="dashboard-info-grid">
        <div className="info-card">
          <span className="info-label">Customer</span>
          <strong className="info-value">
            {pendingCheckout.customer.fullName}
          </strong>
        </div>

        <div className="info-card">
          <span className="info-label">Email</span>
          <strong className="info-value">{pendingCheckout.customer.email}</strong>
        </div>

        <div className="info-card">
          <span className="info-label">Total</span>
          <strong className="info-value">
            {formatCurrency(pendingCheckout.totals.total)}
          </strong>
        </div>

        <div className="info-card">
          <span className="info-label">Stripe Session ID</span>
          <strong className="info-value">{sessionId || "Not available"}</strong>
        </div>
      </div>
    </section>
  );
}