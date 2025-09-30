import { useEffect, useState } from "react";
import axios from "axios";
import { getToken, isUserLoggedIn } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import "../css/OrdersPage.css";

function OrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  if (!isUserLoggedIn()) {
    navigate("/login");
    return null;
  }

  const API_URL = import.meta.env.VITE_API_URL;

  const fetchOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${API_URL}/api/orders/my-orders`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setError(
        err.response?.data?.message || err.message || "Failed to fetch orders"
      );
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      await axios.put(
        `${API_URL}/api/orders/${orderId}/cancel`,
        {},
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      fetchOrders(); // Refresh orders
    } catch (err) {
      console.error("Failed to cancel order:", err);
      alert(err.response?.data?.message || "Failed to cancel order");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getDeliveryEstimate = (createdAt) => {
    const created = new Date(createdAt);
    const eta = new Date(created.getTime() + 60 * 60 * 1000); // 1 hour later
    return eta.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatOrderDate = (createdAt) => {
    const now = new Date();
    const orderDate = new Date(createdAt);

    // Check if same calendar date
    const sameDay =
      now.getFullYear() === orderDate.getFullYear() &&
      now.getMonth() === orderDate.getMonth() &&
      now.getDate() === orderDate.getDate();

    // Check if yesterday (calendar-based)
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday =
      yesterday.getFullYear() === orderDate.getFullYear() &&
      yesterday.getMonth() === orderDate.getMonth() &&
      yesterday.getDate() === orderDate.getDate();

    if (sameDay) return "Today";
    if (isYesterday) return "Yesterday";

    // More user-friendly fallback like "30 Sept, 2025"
    return orderDate.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const statusColors = {
    pending: "#f0ad4e",
    confirmed: "#5bc0de",
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
              <h3>Order: {formatOrderDate(order.createdAt)}</h3>
              <span
                className="order-status"
                style={{
                  backgroundColor: statusColors[order.status] || "#ccc",
                }}
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
            <p>Estimated Delivery: {getDeliveryEstimate(order.createdAt)}</p>

            <ul className="order-items">
              {order.items.map((item, idx) => (
                <li key={idx}>
                  {item.name} × {item.quantity}Kg = ₹
                  {(item.quantity * item.price).toFixed(2)}
                </li>
              ))}
            </ul>

            <p className="order-total">Total: ₹{order.total.toFixed(2)}</p>

            {order.status === "pending" && (
              <button
                className="cancel-btn"
                onClick={() => cancelOrder(order._id)}
              >
                Cancel Order
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default OrdersPage;
