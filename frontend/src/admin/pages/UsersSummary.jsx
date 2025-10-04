import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../css/UsersSummary.css";

function UsersSummary() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

  const fetchUsersSummary = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        setError("Unauthorized. Please login as admin.");
        setLoading(false);
        return;
      }

      const res = await axios.get(`${API_URL}/api/orders/users-summary`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load users summary.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersSummary();
  }, []);

  if (loading) return <p>Loading users summary...</p>;
  if (error) return <p className="message error">{error}</p>;

  const handleViewDetails = (userId) => {
    navigate(`/admin/user/${userId}`);
  };

  return (
    <div className="users-summary-page">
      <h1>Users Summary</h1>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table className="users-summary-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Mobile</th>
              <th>Total Orders</th>
              <th>Delivered Orders</th>
              <th>Cancelled Orders</th>
              <th>Total Spent (₹)</th>
              <th>Avg Order Value (₹)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.user._id}>
                <td>{u.user.name}</td>
                <td>{u.user.mobile || "N/A"}</td>
                <td>{u.totalOrders}</td>
                <td>{u.deliveredOrders}</td>
                <td>{u.cancelledOrders}</td>
                <td>₹{u.totalSpent.toFixed(2)}</td>
                <td>₹{u.avgOrderValue.toFixed(2)}</td>
                <td>
                  <button
                    className="view-details-btn"
                    onClick={() => handleViewDetails(u.user._id)}
                  >
                    VIEW Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default UsersSummary;
