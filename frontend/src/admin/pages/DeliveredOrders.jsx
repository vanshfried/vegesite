import { useEffect, useState } from "react";
import axios from "axios";
import "../../css/ArchivedOrders.css";

function DeliveredOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchDeliveredOrders = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        if (!token) {
          setError("Unauthorized. Please login as admin.");
          setLoading(false);
          return;
        }

        const res = await axios.get(
          `${API_URL}/api/orders?archived=true`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const deliveredOrders = res.data.filter(
          (order) => order.status === "delivered"
        );

        setOrders(deliveredOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to load delivered orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveredOrders();
  }, []);

  const formatAddress = (location) => {
    if (!location?.coordinates) return "N/A";
    return `Lat:${location.coordinates[1].toFixed(2)}, Lng:${location.coordinates[0].toFixed(2)}`;
  };

  if (loading) return <p>Loading delivered orders...</p>;
  if (error) return <p className="message error">{error}</p>;

  return (
    <div className="admin-orders-page">
      <h1>Delivered Orders (Archived)</h1>
      {orders.length === 0 ? (
        <p>No delivered orders archived.</p>
      ) : (
        <table className="orders-table">
          <thead>
            <tr>
              <th>Location</th>
              <th>Items</th>
              <th>Total</th>
              <th>Placed At</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{formatAddress(order.location)}</td>
                <td>
                  {order.items.map((item) => (
                    <span key={item._id}>
                      {item.name}×{item.quantity};{" "}
                    </span>
                  ))}
                </td>
                <td>₹{order.total}</td>
                <td>{new Date(order.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default DeliveredOrders;
