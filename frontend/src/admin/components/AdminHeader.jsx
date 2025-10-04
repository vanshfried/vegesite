import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../css/AdminHeader.css";

function AdminHeader() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login", { replace: true });
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <header className="admin-header">
      <div className="logo">
        <h1>Admin Panel</h1>
      </div>

      {/* Hamburger for mobile */}
      <div className={`hamburger ${menuOpen ? "open" : ""}`} onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <nav className={`admin-nav ${menuOpen ? "open" : ""}`}>
        <Link to="/admin" onClick={() => setMenuOpen(false)}>Dashboard</Link>
        <Link to="/admin/products" onClick={() => setMenuOpen(false)}>Products</Link>
        <Link to="/admin/orders" onClick={() => setMenuOpen(false)}>Orders</Link>
        <Link to="/admin/delivered" onClick={() => setMenuOpen(false)}>Delivered</Link>
        <Link to="/admin/cancelled" onClick={() => setMenuOpen(false)}>Cancelled</Link>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </nav>
    </header>
  );
}

export default AdminHeader;
