import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <section className="page-section">
      <h1>404</h1>
      <p>The page you requested could not be found.</p>
      <Link to="/" className="btn btn-primary">
        Back to Home
      </Link>
    </section>
  );
}