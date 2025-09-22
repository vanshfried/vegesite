import { createContext, useContext, useState, useEffect, useRef } from "react";
import { useAuth } from "./AuthContext";
import axios from "axios";
import { getToken } from "../utils/auth";

const CartContext = createContext();
const API_URL = import.meta.env.VITE_API_URL;

export const CartProvider = ({ children }) => {
  const { loggedIn } = useAuth();
  const [cart, setCart] = useState([]);
  const syncTimeout = useRef(null);

  // Load cart from backend
  useEffect(() => {
    const loadCart = async () => {
      if (!loggedIn) {
        setCart([]);
        return;
      }
      try {
        const token = getToken();
        if (!token) return;

        const res = await axios.get(`${API_URL}/api/cart`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setCart(res.data.items || []);
      } catch (err) {
        console.error("Failed to fetch cart:", err);
        setCart([]);
      }
    };

    loadCart();
  }, [loggedIn]);

  // Debounced backend sync
  useEffect(() => {
    if (!loggedIn) return;
    if (syncTimeout.current) clearTimeout(syncTimeout.current);

    syncTimeout.current = setTimeout(async () => {
      try {
        const token = getToken();
        if (!token) return;

        await axios.post(
          `${API_URL}/api/cart`,
          { items: cart.map(({ _id, quantity }) => ({ productId: _id, quantity })) },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (err) {
        console.error("Failed to sync cart:", err);
      }
    }, 500);

    return () => clearTimeout(syncTimeout.current);
  }, [cart, loggedIn]);

  const setCartItemQuantity = (product, quantity) => {
    if (!loggedIn) return;
    const existing = cart.find(item => item._id === product._id);
    const newCart = existing
      ? cart.map(item => (item._id === product._id ? { ...item, quantity } : item))
      : [...cart, { ...product, quantity }];
    setCart(newCart);
  };

  const updateCartQuantity = (productId, delta) => {
    const newCart = cart.map(item =>
      item._id === productId ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    );
    setCart(newCart);
  };

  const removeFromCart = (productId) => setCart(cart.filter(item => item._id !== productId));
  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{ cart, setCartItemQuantity, updateCartQuantity, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
