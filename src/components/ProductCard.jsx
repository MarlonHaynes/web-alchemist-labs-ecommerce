import { Link } from "react-router-dom";
import { formatCurrency } from "../utils/formatCurrency";

export default function ProductCard({ product }) {
  const isOutOfStock = product.stock === 0;

  return (
    <article className="product-card">
      <Link to={`/products/${product.id}`} className="product-card-image-wrap">
        <img
          src={product.image}
          alt={product.title}
          className="product-card-image"
        />
      </Link>

      <div className="product-card-body">
        <div className="product-card-top">
          <span className="product-category">{product.category}</span>
          {isOutOfStock ? (
            <span className="stock-badge out">Out of Stock</span>
          ) : (
            <span className="stock-badge in">In Stock</span>
          )}
        </div>

        <h3 className="product-title">
          <Link to={`/products/${product.id}`}>{product.title}</Link>
        </h3>

        <p className="product-description">{product.description}</p>

        <div className="product-card-bottom">
          <strong className="product-price">
            {formatCurrency(product.price)}
          </strong>

          <Link to={`/products/${product.id}`} className="btn btn-secondary">
            View Product
          </Link>
        </div>
      </div>
    </article>
  );
}