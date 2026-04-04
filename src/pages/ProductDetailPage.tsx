import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProductById } from "../services/productService";
import { formatCurrency } from "../utils/formatCurrency";
import LoadingState from "../components/LoadingState";
import EmptyState from "../components/EmptyState";
import { useCart } from "../context/CartContext";

export default function ProductDetailPage() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [cartMessage, setCartMessage] = useState("");

  const { addToCart, cartItems } = useCart();

  useEffect(() => {
    window.scrollTo(0, 0);

    async function loadProduct() {
      setIsLoading(true);
      const data = await getProductById(id);
      setProduct(data);
      setSelectedQuantity(1);
      setCartMessage("");
      setIsLoading(false);
    }

    loadProduct();
  }, [id]);

  useEffect(() => {
    if (!cartMessage) {
      return;
    }

    const timer = setTimeout(() => {
      setCartMessage("");
    }, 2000);

    return () => clearTimeout(timer);
  }, [cartMessage]);

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
  const cartItem = cartItems.find((item) => item.id === product.id);
  const quantityAlreadyInCart = cartItem?.quantity || 0;
  const remainingStock = Math.max(product.stock - quantityAlreadyInCart, 0);

  function handleDecrease() {
    setSelectedQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  }

  function handleIncrease() {
    setSelectedQuantity((prev) => {
      if (prev >= remainingStock) {
        return prev;
      }
      return prev + 1;
    });
  }

  function handleQuantityChange(event) {
    const value = Number(event.target.value);

    if (!value || value < 1) {
      setSelectedQuantity(1);
      return;
    }

    if (value > remainingStock) {
      setSelectedQuantity(remainingStock || 1);
      return;
    }

    setSelectedQuantity(value);
  }

  function handleAddToCart() {
    if (isOutOfStock || remainingStock < 1) {
      setCartMessage("This item is out of stock.");
      return;
    }

    const safeQuantity =
      selectedQuantity > remainingStock ? remainingStock : selectedQuantity;

    addToCart(product, safeQuantity);
    setCartMessage(
      `${safeQuantity} item${safeQuantity > 1 ? "s" : ""} added to cart.`
    );
    setSelectedQuantity(1);
  }

  return (
    <div className="product-detail-page">
      <section
        className="product-detail-card"
        style={{ alignItems: "flex-start" }}
      >
        <div
          className="product-detail-image-panel"
          style={{ alignSelf: "stretch", overflow: "hidden" }}
        >
          <img
            src={product.image}
            alt={product.title}
            className="product-detail-image"
            style={{
              display: "block",
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
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

          {!isOutOfStock ? (
            <div className="product-detail-quantity">
              <p className="checkout-item-meta">
                {remainingStock} available to add
              </p>

              <div
                className="cart-controls"
                style={{ display: "flex", gap: "10px", alignItems: "center" }}
              >
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleDecrease}
                >
                  -
                </button>

                <input
                  type="number"
                  min="1"
                  max={remainingStock || 1}
                  value={selectedQuantity}
                  onChange={handleQuantityChange}
                  style={{ width: "80px", textAlign: "center" }}
                />

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleIncrease}
                  disabled={selectedQuantity >= remainingStock}
                >
                  +
                </button>
              </div>
            </div>
          ) : null}

          <div className="product-detail-actions">
            <button
              type="button"
              className="btn btn-primary"
              disabled={isOutOfStock || remainingStock < 1}
              onClick={handleAddToCart}
            >
              {isOutOfStock || remainingStock < 1 ? "Out of Stock" : "Add to Cart"}
            </button>

            <Link to="/products" className="btn btn-secondary">
              Back to Shop
            </Link>
          </div>

          <div style={{ minHeight: "32px", marginTop: "12px" }}>
            {cartMessage ? (
              <p className="checkout-item-meta" style={{ fontWeight: "600" }}>
                {cartMessage}
              </p>
            ) : null}
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