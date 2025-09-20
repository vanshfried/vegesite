import { useState } from "react";
import { Link } from "react-router-dom";
import "../css/Header.css";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

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
        <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
        <Link to="/cart" onClick={() => setMenuOpen(false)}>Cart</Link>
        <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link>
        <Link to="/previousorder" onClick={() => setMenuOpen(false)}>Prev. Orders</Link>
      </nav>
    </header>
  );
}

export default Header;
