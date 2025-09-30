import { useState } from "react";
import { useCart } from "../context/CartContext";
import "../css/CartPage.css";
import { isUserLoggedIn, getToken } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function CartPage() {
  const navigate = useNavigate();
  const loggedIn = isUserLoggedIn();
  const { cart, removeFromCart, clearCart } = useCart();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!loggedIn) {
    navigate("/login");
    return null;
  }

  const DELIVERY = 20;
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal + DELIVERY;

  const getUserLocation = () =>
    new Promise((resolve, reject) => {
      if (!navigator.geolocation) reject("Geolocation not supported");
      else {
        navigator.geolocation.getCurrentPosition(
          (pos) =>
            resolve({
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
            }),
          (err) => reject(err.message)
        );
      }
    });

  const placeOrder = async () => {
    if (!cart.length) return alert("Cart is empty!");
    setLoading(true);
    setError("");

    try {
      const location = await getUserLocation();
      const token = getToken(); // assume this returns JWT

      const API_URL = import.meta.env.VITE_API_URL;

      const res = await axios.post(
        `${API_URL}/api/orders`,
        {
          cart,
          subtotal,
          deliveryFee: DELIVERY,
          total,
          location,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Order placed successfully!");
      clearCart();
      console.log("Order created:", res.data.order);
    } catch (err) {
      console.error("Order failed:", err);
      setError(err.response?.data?.message || err.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  if (!cart.length)
    return (
      <div className="cart-empty">
        <p>Your cart is empty</p>
        <span>🛒 Add some veggies to place an order!</span>
      </div>
    );

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>
      {error && <p className="error-msg">{error}</p>}
      <ul>
        {cart.map((item) => (
          <li key={item._id}>
            <div className="cart-item-left">
              {item.image ? (
                <img
                  src={`${import.meta.env.VITE_API_URL}${item.image.startsWith("/uploads/") ? item.image : `/uploads/${item.image}`}`}
                  alt={item.name}
                  className="cart-item-img"
                />
              ) : (
                <div className="cart-item-img placeholder">No Image</div>
              )}
              <span className="cart-item-name">{item.name}</span>
            </div>
            <div className="cart-item-right">
              <span className="cart-item-qty">
                {item.quantity}Kg × ₹{item.price} = ₹{(item.price * item.quantity).toFixed(2)}
              </span>
              <button className="delete-btn" onClick={() => removeFromCart(item._id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>

      <div className="cart-summary">
        <p>Subtotal: ₹{subtotal.toFixed(2)}</p>
        <p>Delivery: ₹{DELIVERY}</p>
        <h3>Total: ₹{total.toFixed(2)}</h3>
      </div>

      <button className="place-order-btn" onClick={placeOrder} disabled={loading}>
        {loading ? "Placing Order..." : "Place Order"}
      </button>
    </div>
  );
}

export default CartPage;
