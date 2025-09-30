import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import "../css/HomePage.css";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { isUserLoggedIn } from "../utils/auth";

function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { cart } = useCart();
  const navigate = useNavigate();
  const loggedIn = isUserLoggedIn();

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL;
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/products`);
        setProducts(res.data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <p>Loading products...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="home-page">
      <h1>Fresh Vegetables</h1>

      {products.length === 0 ? (
        <p>No products available at the moment.</p>
      ) : (
        <div className="home-product-grid">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}

      {loggedIn && cart.length > 0 && (
        <div className="cart-popup sticky-popup">
          <button onClick={() => navigate("/cart")}>
            Go to Cart ({cart.length} item{cart.length > 1 ? "s" : ""})
          </button>
        </div>
      )}
    </div>
  );
}

export default HomePage;
