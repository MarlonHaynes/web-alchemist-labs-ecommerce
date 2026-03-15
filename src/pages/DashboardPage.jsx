import { useAuth } from "../context/AuthContext";

export default function DashboardPage() {
  const { currentUser } = useAuth();

  return (
    <section className="page-section">
      <h1>My Account</h1>
      <p>Welcome to your customer dashboard.</p>

      <div className="dashboard-info-grid">
        <div className="info-card">
          <span className="info-label">Logged In As</span>
          <strong className="info-value">{currentUser?.email}</strong>
        </div>

        <div className="info-card">
          <span className="info-label">User ID</span>
          <strong className="info-value">{currentUser?.uid}</strong>
        </div>

        <div className="info-card">
          <span className="info-label">Account Status</span>
          <strong className="info-value">Authenticated</strong>
        </div>
      </div>
    </section>
  );
}