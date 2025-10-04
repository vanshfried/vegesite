import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../css/UserDetails.css";

function UserDetails() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;

  const fetchUserOrders = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        setError("Unauthorized. Please login as admin.");
        setLoading(false);
        return;
      }

      const res = await axios.get(
        `${API_URL}/api/orders/users/${userId}/orders`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.length > 0) setUser(res.data[0].user);
      setOrders(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load user orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchUserOrders();
  }, [userId]);

  const totalSpent = orders
    .filter((o) => o.status === "delivered")
    .reduce((acc, o) => acc + (o.total || 0), 0);

  const deliveredCount = orders.filter((o) => o.status === "delivered").length;
  const avgSpent = deliveredCount > 0 ? totalSpent / deliveredCount : 0;

  if (loading) return <p>Loading user orders...</p>;
  if (error) return <p className="message error">{error}</p>;
  if (!user) return <p>User not found.</p>;

  const formatAddress = (address) => {
    if (!address) return "N/A";
    return `${address.houseNo}, ${address.laneOrSector}, ${address.landmark}, ${address.pincode}`;
  };

  return (
    <div className="user-details-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        &larr; Back
      </button>

      {/* User Info & Metrics */}
      <div className="user-info">
        <div>
          <h2>{user.name}</h2>
          <p>Mobile: {user.mobile || "N/A"}</p>
          <p>Address: {formatAddress(user.address)}</p>
        </div>

        <div className="metrics">
          <div className="metric-card">
            <h3>{orders.length}</h3>
            <p>Total Orders</p>
          </div>
          <div className="metric-card">
            <h3>{deliveredCount}</h3>
            <p>Delivered</p>
          </div>
          <div className="metric-card">
            <h3>₹{totalSpent.toFixed(2)}</h3>
            <p>Total Spent</p>
          </div>
          <div className="metric-card">
            <h3>₹{avgSpent.toFixed(2)}</h3>
            <p>Avg Order Value</p>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <table className="user-orders-table">
          <thead>
            <tr>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Placed At</th>
              <th>Delivery Location</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className={order.status}>
                <td>
                  {order.items.map((item, idx) => (
                    <span key={item._id || idx}>
                      {item.name} × {item.quantity};{" "}
                    </span>
                  ))}
                </td>
                <td>₹{order.total}</td>
                <td>
                  <span className={`status-pill ${order.status}`}>
                    {order.status.replace(/-/g, " ")}
                  </span>
                </td>
                <td>{new Date(order.createdAt).toLocaleString()}</td>
                <td>
                  {order.location?.coordinates
                    ? `Lat: ${order.location.coordinates[1].toFixed(
                        5
                      )}, Lng: ${order.location.coordinates[0].toFixed(5)}`
                    : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default UserDetails;
