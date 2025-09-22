// src/admin/pages/AdminDashboard.jsx
import "../../css/AdminDashboard.css";
import AdminLogin from "./AdminLogin";


const AdminDashboard = () => {
  const token = localStorage.getItem("adminToken");

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    window.location.href = "/admin"; // reload to show login
  };

  if (!token) return <AdminLogin />;

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      <ul>
        <li><a href="/admin/add-product">Add Product</a></li>
        <li><a href="/admin/products">View Products</a></li>
      </ul>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default AdminDashboard;
