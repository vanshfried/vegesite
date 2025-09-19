import { Link } from "react-router-dom";
import "../css/Header.css";

function Header() {
  return (
    <header className="user-header">
      <div className="logo">
        <h1>Vishal Vegetable Store</h1>
      </div>

      <nav className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/cart">Cart</Link>
        <Link to="/about">About</Link>
        <Link to="/previousorder">Prev. Orders</Link>
      </nav>
    </header>
  );
}

export default Header;
