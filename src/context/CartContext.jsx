import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export default function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");

    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  function addToCart(product) {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);

      if (existing) {
        const nextQuantity = existing.quantity + 1;
        const maxStock = product.stock ?? 0;

        if (nextQuantity > maxStock) {
          return prev;
        }

        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: nextQuantity }
            : item
        );
      }

      if ((product.stock ?? 0) < 1) {
        return prev;
      }

      return [...prev, { ...product, quantity: 1 }];
    });
  }

  function removeFromCart(productId) {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  }

  function updateQuantity(productId, quantity) {
    if (quantity <= 0) {
      return;
    }

    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id !== productId) {
          return item;
        }

        const maxStock = item.stock ?? quantity;
        const safeQuantity = quantity > maxStock ? maxStock : quantity;

        return {
          ...item,
          quantity: safeQuantity,
        };
      })
    );
  }

  function clearCart() {
    setCartItems([]);
  }

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}