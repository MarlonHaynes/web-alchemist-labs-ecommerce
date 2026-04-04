export default function AdminStatCard({ label, value, helperText }) {
  return (
    <article className="admin-stat-card">
      <span className="admin-stat-label">{label}</span>
      <strong className="admin-stat-value">{value}</strong>
      {helperText ? <p className="admin-stat-helper">{helperText}</p> : null}
    </article>
  );
}