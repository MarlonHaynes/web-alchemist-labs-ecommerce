import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <section className="page-section">
      <div className="hero">
        <div className="hero-copy">
          <span className="eyebrow">Modern Commerce Experience</span>
          <h1>Build, Sell, and Scale with Web Alchemist Labs Ecommerce</h1>
          <p>
            A production-style ecommerce portfolio application built with React,
            Firebase, Stripe, and modern admin workflows.
          </p>

          <div className="hero-actions">
            <Link to="/products" className="btn btn-primary">
              Shop Products
            </Link>
            <Link to="/admin" className="btn btn-secondary">
              View Admin Area
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}