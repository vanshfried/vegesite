// src/pages/NotFound.jsx
import { Link } from "react-router-dom";
import "../css/NotFound.css";

function NotFound() {
  return (
    <div className="notfound-page">
      <h1>404 - Page Not Found</h1>
      <p>Oops! The page you’re looking for doesn’t exist.</p>
      <Link to="/" className="back-home-btn">Go Back Home</Link>
    </div>
  );
}

export default NotFound;
