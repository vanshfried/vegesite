import { useEffect, useState } from "react";
import axios from "axios";
import "../../css/ProductList.css";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        if (!token) {
          setError("Unauthorized. Please login as admin.");
          setLoading(false);
          return;
        }

        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/products`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(res.data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError(err.response?.data?.error || "Failed to load products.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const token = localStorage.getItem("adminToken");
      if (!token) return alert("Unauthorized. Please login as admin.");

      await axios.delete(`${import.meta.env.VITE_API_URL}/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProducts(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      console.error("Failed to delete product:", err);
      alert(err.response?.data?.error || "Failed to delete product.");
    }
  };

  if (loading) return <p>Loading products...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="product-list-page">
      <h1>Product List (Admin)</h1>
      {products.length === 0 ? (
        <p>No products available.</p>
      ) : (
        <div className="product-list-grid">
          {products.map(product => (
            <div key={product._id} className="product-item">
              <img src={product.image ? `${import.meta.env.VITE_API_URL}${product.image}` : ""} alt={product.name} />
              <h3>{product.name}</h3>
              <p>Price: ₹{product.price}</p>
              <p>{product.stock ? "In Stock" : "Out of Stock"}</p>
              <button onClick={() => handleDelete(product._id)} style={{ backgroundColor: "red", color: "#fff", marginTop: "5px" }}>
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductList;
