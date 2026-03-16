export default function LoadingState({ message = "Loading..." }) {
  return (
    <div className="loading-state loading-state-enhanced">
      <div className="loading-spinner" />
      <p>{message}</p>
    </div>
  );
}