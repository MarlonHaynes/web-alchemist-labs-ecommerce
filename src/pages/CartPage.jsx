import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatCurrency } from "../utils/formatCurrency";

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();

  if (!cartItems.length) {
    return (
      <div className="empty-state">
        <h2>Your cart is empty</h2>
        <Link to="/products" className="btn btn-primary">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>

      <div className="cart-layout">
        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <img src={item.image} alt={item.title} />

              <div className="cart-item-info">
                <h3>{item.title}</h3>
                <p>{formatCurrency(item.price)}</p>

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