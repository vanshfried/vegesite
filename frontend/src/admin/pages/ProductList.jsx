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
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/products`
        );
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

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Failed to delete product:", err);
      alert("Failed to delete product. Please try again.");
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
          {products.map((product) => (
            <div key={product._id} className="product-item">
              <img
                src={
                  product.image
                    ? `${import.meta.env.VITE_API_URL}${product.image}`
                    : ""
                }
                alt={product.name}
              />

              <h3>{product.name}</h3>
              <p>Price: ₹{product.price}</p>
              <p>{product.stock ? "In Stock" : "Out of Stock"}</p>
              {/* Delete button shown here, separate from ProductCard */}
              <button
                onClick={() => handleDelete(product._id)}
                style={{
                  backgroundColor: "red",
                  color: "#fff",
                  marginTop: "5px",
                }}
              >
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
