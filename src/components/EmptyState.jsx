export default function EmptyState({ title, description }) {
  return (
    <div className="empty-state empty-state-enhanced">
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}