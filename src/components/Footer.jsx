import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatCurrency } from "../utils/formatCurrency";
import EmptyState from "../components/EmptyState";

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();

  if (!cartItems.length) {
    return (
      <EmptyState
        title="Your cart is empty"
        description="Add products to your cart to begin checkout."
      />
    );
  }

  return (
    <div className="cart-page">
      <section className="page-hero">
        <span className="eyebrow">Shopping Cart</span>
        <h1>Review your selected products</h1>
        <p>
          Update quantities, remove items, and continue to secure checkout when
          you are ready.
        </p>
      </section>

      <div className="cart-layout">
        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <img src={item.image} alt={item.title} />

              <div className="cart-item-info">
                <h3>{item.title}</h3>
                <p>{formatCurrency(item.price)}</p>
                <p className="checkout-item-meta">Available stock: {item.stock}</p>

                <div className="cart-controls">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(item.id, Number(e.target.value))
                    }
                  />

                  <button
                    className="btn btn-secondary"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>

              <div className="cart-item-total">
                {formatCurrency(item.price * item.quantity)}
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h3>Order Summary</h3>

          <div className="summary-row">
            <span>Total</span>
            <strong>{formatCurrency(cartTotal)}</strong>
          </div>

          <Link to="/checkout" className="btn btn-primary">
            Go to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}