import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export default function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem("cartItems");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  function addToCart(product, quantity = 1) {
    const requestedQuantity = Number(quantity);

    if (!requestedQuantity || requestedQuantity < 1) {
      return;
    }

    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      const maxStock = product.stock ?? 0;

      if (maxStock < 1) {
        return prev;
      }

      if (existing) {
        const nextQuantity = existing.quantity + requestedQuantity;
        const safeQuantity = nextQuantity > maxStock ? maxStock : nextQuantity;

        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: safeQuantity }
            : item
        );
      }

      const safeQuantity = requestedQuantity > maxStock ? maxStock : requestedQuantity;

      return [...prev, { ...product, quantity: safeQuantity }];
    });
  }

  function removeFromCart(productId) {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  }

  function updateQuantity(productId, quantity) {
    const parsedQuantity = Number(quantity);

    if (!parsedQuantity || parsedQuantity <= 0) {
      return;
    }

    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id !== productId) {
          return item;
        }

        const maxStock = item.stock ?? parsedQuantity;
        const safeQuantity = parsedQuantity > maxStock ? maxStock : parsedQuantity;

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