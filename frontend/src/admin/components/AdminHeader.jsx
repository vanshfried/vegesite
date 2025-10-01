// src/admin/components/AdminHeader.jsx
import { Link, useNavigate } from "react-router-dom";
import "../../css/AdminHeader.css";

function AdminHeader() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login", { replace: true });
  };

  return (
    <header className="admin-header">
      <div className="logo">
        <h1>Admin Panel</h1>
      </div>
      <nav className="admin-nav">
        <Link to="/admin">Dashboard</Link>
        <Link to="/admin/products">Products</Link>
        <Link to="/admin/orders">Orders</Link>
        <Link to="/admin/delivered">Delivered</Link>
        <Link to="/admin/cancelled">Cancelled</Link>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </nav>
    </header>
  );
}

export default AdminHeader;
