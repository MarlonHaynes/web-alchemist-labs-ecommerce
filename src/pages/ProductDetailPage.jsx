import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProductById } from "../services/productService";
import { formatCurrency } from "../utils/formatCurrency";
import LoadingState from "../components/LoadingState";
import EmptyState from "../components/EmptyState";

export default function ProductDetailPage() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProduct() {
      setIsLoading(true);
      const data = await getProductById(id);
      setProduct(data);
      setIsLoading(false);
    }

    loadProduct();
  }, [id]);

  if (isLoading) {
    return <LoadingState message="Loading product details..." />;
  }

  if (!product) {
    return (
      <EmptyState
        title="Product not found"
        description="The product you requested does not exist or may have been removed."
      />
    );
  }

  const isOutOfStock = product.stock === 0;

  return (
    <div className="product-detail-page">
      <section className="product-detail-card">
        <div className="product-detail-image-panel">
          <img
            src={product.image}
            alt={product.title}
            className="product-detail-image"
          />
        </div>

        <div className="product-detail-content">
          <div className="product-detail-meta">
            <span className="product-detail-category">{product.category}</span>

            {isOutOfStock ? (
              <span className="stock-badge out">Out of Stock</span>
            ) : (
              <span className="stock-badge in">{product.stock} in stock</span>
            )}
          </div>

          <h1 className="product-detail-title">{product.title}</h1>

          <p className="product-detail-price">{formatCurrency(product.price)}</p>

          <p className="product-detail-description">{product.description}</p>

          <div className="product-detail-actions">
            <button
              type="button"
              className="btn btn-primary"
              disabled={isOutOfStock}
            >
              {isOutOfStock ? "Out of Stock" : "Add to Cart"}
            </button>

            <Link to="/products" className="btn btn-secondary">
              Back to Shop
            </Link>
          </div>

          <div className="product-detail-info-grid">
            <div className="info-card">
              <span className="info-label">Product ID</span>
              <strong className="info-value">{product.id}</strong>
            </div>

            <div className="info-card">
              <span className="info-label">Category</span>
              <strong className="info-value product-category-cap">
                {product.category}
              </strong>
            </div>

            <div className="info-card">
              <span className="info-label">Availability</span>
              <strong className="info-value">
                {isOutOfStock ? "Unavailable" : "Available"}
              </strong>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}