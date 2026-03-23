import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatCurrency } from "../utils/formatCurrency";
import PageHero from "../components/PageHero";

const HST_RATE = 0.13;

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();

  const hstAmount = cartTotal * HST_RATE;
  const finalTotal = cartTotal + hstAmount;

  if (!cartItems.length) {
    return (
      <div className="cart-page">
        <PageHero
          eyebrow="Shopping Cart"
          title="Your cart is currently empty"
          description="Browse the collection and add products to begin your order."
        />

        <div className="empty-state">
          <h2>No items added yet</h2>
          <Link to="/products" className="btn btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <PageHero
        eyebrow="Shopping Cart"
        title="Review your selected items"
        description="Adjust quantities, remove items, and continue to checkout from the updated classic cart layout."
      />

      <div className="cart-layout">
        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <img src={item.image} alt={item.title} />

              <div className="cart-item-info">
                <span className="product-category">{item.category}</span>
                <h3>{item.title}</h3>
                <p>{formatCurrency(item.price)}</p>
                <p className="checkout-item-meta">Available stock: {item.stock}</p>

                <div className="cart-controls">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>

                  <input
                    type="number"
                    min="1"
                    max={item.stock}
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(item.id, Number(e.target.value))
                    }
                  />

                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    disabled={item.quantity >= item.stock}
                  >
                    +
                  </button>

                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>

              <div className="cart-item-total">
                <strong>{formatCurrency(item.price * item.quantity)}</strong>
              </div>
            </div>
          ))}
        </div>

        <aside className="cart-summary">
          <h3>Order Summary</h3>

          <div className="summary-row">
            <span>Subtotal</span>
            <strong>{formatCurrency(cartTotal)}</strong>
          </div>

          <div className="summary-row">
            <span>HST (13%)</span>
            <strong>{formatCurrency(hstAmount)}</strong>
          </div>

          <div className="summary-row">
            <span>Total</span>
            <strong>{formatCurrency(finalTotal)}</strong>
          </div>

          <Link to="/checkout" className="btn btn-primary">
            Go to Checkout
          </Link>
        </aside>
      </div>
    </div>
  );
}