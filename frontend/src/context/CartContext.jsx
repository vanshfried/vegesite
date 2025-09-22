import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { loggedIn } = useAuth();
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  // If user logs out → clear cart instantly
  useEffect(() => {
    if (!loggedIn) {
      setCart([]);
      localStorage.removeItem("cart");
    }
  }, [loggedIn]);

  // Persist cart
  useEffect(() => {
    if (loggedIn) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart, loggedIn]);

  const setCartItemQuantity = (product, quantity) => {
    if (!loggedIn) return;
    setCart((prev) => {
      const existing = prev.find((item) => item._id === product._id);
      if (existing) {
        return prev.map((item) =>
          item._id === product._id ? { ...item, quantity } : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const updateCartQuantity = (productId, delta) => {
    if (!loggedIn) return;
    setCart((prev) =>
      prev.map((item) =>
        item._id === productId
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeFromCart = (productId) => {
    if (!loggedIn) return;
    setCart((prev) => prev.filter((item) => item._id !== productId));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        setCartItemQuantity,
        updateCartQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
