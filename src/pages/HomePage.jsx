import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getFeaturedProducts } from "../services/productService";
import ProductGrid from "../components/ProductGrid";
import SectionHeading from "../components/SectionHeading";
import FirebaseStatus from "../components/FirebaseStatus";

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    async function loadFeaturedProducts() {
      const data = await getFeaturedProducts(4);
      setFeaturedProducts(data);
    }

    loadFeaturedProducts();
  }, []);

  return (
    <div className="home-page">
      <section className="page-section hero-section">
        <div className="hero">
          <div className="hero-copy">
            <span className="eyebrow">Modern Commerce Experience</span>
            <h1>Premium essentials built for a modern online store.</h1>
            <p>
              Web Alchemist Labs Ecommerce is a production-style portfolio
              project focused on clean UI, scalable architecture, and real
              ecommerce workflows.
            </p>

            <div className="hero-actions">
              <Link to="/products" className="btn btn-primary">
                Shop Collection
              </Link>
              <Link to="/dashboard" className="btn btn-secondary">
                View Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="content-section">
        <FirebaseStatus />

        <SectionHeading
          eyebrow="Featured Products"
          title="New arrivals curated for the storefront"
          description="These products are currently loaded from a local product data source that will later be replaced by Firestore."
        />

        <ProductGrid products={featuredProducts} />
      </section>
    </div>
  );
}