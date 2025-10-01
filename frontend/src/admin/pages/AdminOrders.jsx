import { useEffect, useState } from "react";
import axios from "axios";
import "../../css/AdminOrders.css";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [editing, setEditing] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;

  const statusColors = {
    processing: "#f0ad4e",
    "out-for-delivery": "#5bc0de",
    delivered: "#5cb85c",
    cancelled: "#d9534f",
  };

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        setError("Unauthorized. Please login as admin.");
        setLoading(false);
        return;
      }
      const res = await axios.get(`${API_URL}/api/orders?archived=false`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const allOrders = res.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setOrders(allOrders);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setError(err.response?.data?.message || "Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const showMessage = (type, text, duration = 4000) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), duration);
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.put(
        `${API_URL}/api/orders/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders((prev) =>
        prev.map((o) => (o._id === id ? res.data.order : o))
      );
      showMessage("success", "Order status updated!");
      setEditing(null);
    } catch (err) {
      console.error("Failed to update status:", err);
      showMessage(
        "error",
        err.response?.data?.message || "Failed to update status."
      );
    }
  };

  const handleClearHistory = async () => {
    if (
      !window.confirm(
        "Are you sure you want to archive all delivered and cancelled orders?"
      )
    )
      return;
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.put(
        `${API_URL}/api/orders/clear-history`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showMessage(
        "success",
        `${res.data.archivedCount} orders archived successfully!`
      );
      fetchOrders();
    } catch (err) {
      console.error(err);
      showMessage(
        "error",
        err.response?.data?.message || "Failed to archive orders."
      );
    }
  };

  const formatAddress = (location) => {
    if (!location?.coordinates) return "N/A";
    return `Lat:${location.coordinates[1].toFixed(
      2
    )}, Lng:${location.coordinates[0].toFixed(2)}`;
  };

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p className="message error">{error}</p>;

  return (
    <div className="admin-orders-page">
      <h1>All Orders</h1>
      {message && <div className={`message ${message.type}`}>{message.text}</div>}

      <div style={{ marginBottom: "10px", textAlign: "right" }}>
        <button className="clear-history-btn" onClick={handleClearHistory}>
          🧹 Archive Delivered/Cancelled Orders
        </button>
      </div>

      {orders.length === 0 ? (
        <p>No active orders right now.</p>
      ) : (
        <table className="orders-table">
          <thead>
            <tr>
              <th>Location</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Placed At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className={order.status}>
                <td>{formatAddress(order.location)}</td>
                <td>
                  {order.items.map((item) => (
                    <span key={item._id}>
                      {item.name}×{item.quantity};{" "}
                    </span>
                  ))}
                </td>
                <td>₹{order.total}</td>
                <td>
                  {editing === order._id ? (
                    <select
                      defaultValue={order.status}
                      onChange={(e) =>
                        handleStatusUpdate(order._id, e.target.value)
                      }
                    >
                      <option value="processing">Processing</option>
                      <option value="out-for-delivery">Out-for-Delivery</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  ) : (
                    <span
                      className="status-pill"
                      style={{ backgroundColor: statusColors[order.status] }}
                    >
                      {order.status.replace(/-/g, " ")}
                    </span>
                  )}
                </td>
                <td>{new Date(order.createdAt).toLocaleString()}</td>
                <td>
                  {editing === order._id ? (
                    <button onClick={() => setEditing(null)}>❌ Cancel Edit</button>
                  ) : (
                    <button onClick={() => setEditing(order._id)}>✏️ Update</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminOrders;
