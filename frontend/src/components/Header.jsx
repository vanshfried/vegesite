import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/Header.css";
import { isUserLoggedIn } from "../utils/auth";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [popup, setPopup] = useState({ message: "", show: false });
  const navigate = useNavigate();

  const loggedIn = isUserLoggedIn();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("userToken");
    navigate("/", { replace: true });
  };

  const handleRestrictedClick = (path) => {
    if (!loggedIn) {
      setPopup({ message: "Please login to access this page.", show: true });
      setTimeout(() => setPopup({ message: "", show: false }), 3000);
    } else {
      navigate(path);
    }
    setMenuOpen(false);
  };

  return (
    <header className="user-header">
      <div className="logo">
        <h1>Vishal Vegetable Store</h1>
      </div>

      {/* Hamburger button */}
      <div
        className={`hamburger ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

      <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
        {/* Always accessible links */}
        <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
        <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link>

        {/* Restricted links */}
        <span className="nav-button" onClick={() => handleRestrictedClick("/cart")}>Cart</span>
        <span className="nav-button" onClick={() => handleRestrictedClick("/orders")}>Orders</span>
        <span className="nav-button" onClick={() => handleRestrictedClick("/Settings")}>Settings</span>


        {/* Login / Logout */}
        {loggedIn ? (
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        ) : (
          <Link to="/login" className="nav-button" onClick={() => setMenuOpen(false)}>Login</Link>
        )}
      </nav>

      {/* Popup */}
      {popup.show && (
        <div className="header-popup">{popup.message}</div>
      )}
    </header>
  );
}

export default Header;
