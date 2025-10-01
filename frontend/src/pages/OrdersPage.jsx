import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { getToken } from "../utils/auth";
import "../css/OrdersPage.css";

function OrdersPage() {
  const { loggedIn } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!loggedIn) {
      setError("You must be logged in to view your orders.");
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      setLoading(true);
      setError("");
      try {
        const token = getToken();
        if (!token) throw new Error("No token found");

        const res = await axios.get(`${API_URL}/api/users/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Convert all pending → processing on load
        const updatedOrders = res.data.map((o) =>
          o.status === "pending" ? { ...o, status: "processing" } : o
        );

        setOrders(updatedOrders);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setError(
          err.response?.data?.message || err.message || "Failed to fetch orders"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [API_URL, loggedIn]);

  // Cancel order within 3-minute window
  const cancelOrder = async (order) => {
    const createdTime = new Date(order.createdAt).getTime();
    if (Date.now() - createdTime > 3 * 60 * 1000) {
      alert("Cancellation window expired. You cannot cancel this order.");
      return;
    }

    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    try {
      const token = getToken();
      await axios.put(
        `${API_URL}/api/users/orders/${order._id}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOrders((prev) =>
        prev.map((o) =>
          o._id === order._id ? { ...o, status: "cancelled", countdown: null } : o
        )
      );
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to cancel order");
    }
  };

  // Live countdown for cancellation
  useEffect(() => {
    const interval = setInterval(() => {
      setOrders((prev) =>
        prev.map((order) => {
          const createdTime = new Date(order.createdAt).getTime();
          const now = Date.now();
          const diff = 1 * 60 * 1000 - (now - createdTime);

          const countdown =
            diff > 0
              ? `${Math.floor(diff / 1000 / 60)}:${String(
                  Math.floor((diff / 1000) % 60)
                ).padStart(2, "0")}`
              : null;

          return { ...order, countdown };
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const statusColors = {
    processing: "#f0ad4e",
    "out-for-delivery": "#5bc0de",
    delivered: "#5cb85c",
    cancelled: "#d9534f",
  };

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!orders.length) return <p>You have no orders yet.</p>;

  return (
    <div className="orders-page">
      <h1>Your Orders</h1>
      <ul className="orders-list">
        {orders.map((order) => (
          <li key={order._id} className="order-item">
            <div className="order-header">
              <h3>Order: {new Date(order.createdAt).toLocaleDateString()}</h3>
              <span
                className="order-status"
                style={{ backgroundColor: statusColors[order.status] || "#ccc" }}
              >
                {order.status.toUpperCase()}
              </span>
            </div>

            <p>
              Placed:{" "}
              {new Date(order.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>

            <ul className="order-items">
              {order.items.map((item, idx) => (
                <li key={idx}>
                  {item.name} × {item.quantity}Kg = ₹
                  {(item.quantity * item.price).toFixed(2)}
                </li>
              ))}
            </ul>

            <p className="order-total">Total: ₹{order.total.toFixed(2)}</p>

            {order.status === "processing" && order.countdown && (
              <div className="order-actions">
                <button className="cancel-btn" onClick={() => cancelOrder(order)}>
                  Cancel Order
                </button>
                <span className="countdown">Time left: {order.countdown}</span>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default OrdersPage;
