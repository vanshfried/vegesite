// src/admin/pages/AdminLogin.jsx
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../css/AdminLogin.css";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/admin/login`,
        { email, password }
      );

      // Save JWT in localStorage
      localStorage.setItem("adminToken", res.data.token);

      setIsError(false);
      setMessage("Login successful! Redirecting...");
      setTimeout(() => navigate("/admin/products"), 1000); // redirect after short delay
    } catch (err) {
      console.error(err);
      setIsError(true);
      setMessage(err.response?.data?.error || "Login failed. Try again.");
    }
  };

  return (
    <div className="admin-login">
      <h2>Admin Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>

        {message && (
          <p className={`login-message ${isError ? "error" : "success"}`}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
}

export default AdminLogin;
