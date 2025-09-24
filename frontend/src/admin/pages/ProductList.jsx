import { useEffect, useState } from "react";
import axios from "axios";
import "../../css/ProductList.css";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [confirming, setConfirming] = useState(null); // product ID for delete confirmation
  const [editing, setEditing] = useState(null); // product ID for edit mode
  const [editData, setEditData] = useState({ price: "", stock: true });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        if (!token) {
          setError("Unauthorized. Please login as admin.");
          setLoading(false);
          return;
        }

        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/products`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
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

  const showMessage = (type, text, duration = 4000) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), duration);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        showMessage("error", "Unauthorized. Please login as admin.");
        return;
      }

      await axios.delete(`${import.meta.env.VITE_API_URL}/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProducts((prev) => prev.filter((p) => p._id !== id));
      setConfirming(null);
      showMessage("success", "Product deleted successfully!");
    } catch (err) {
      console.error("Failed to delete product:", err);
      showMessage(
        "error",
        err.response?.data?.error || "Failed to delete product."
      );
      setConfirming(null);
    }
  };

  const handleEditInit = (product) => {
    setEditing(product._id);
    setEditData({ price: product.price, stock: product.stock });
  };

  const handleEditChange = (field, value) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdate = async (id) => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        showMessage("error", "Unauthorized. Please login as admin.");
        return;
      }

      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/products/${id}`,
        {
          price: editData.price,
          stock: editData.stock,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setProducts((prev) =>
        prev.map((p) =>
          p._id === id
            ? { ...p, price: res.data.price, stock: res.data.stock }
            : p
        )
      );

      setEditing(null);
      showMessage("success", "Product updated successfully!");
    } catch (err) {
      console.error("Failed to update product:", err);
      showMessage(
        "error",
        err.response?.data?.error || "Failed to update product."
      );
    }
  };

  if (loading) return <p>Loading products...</p>;
  if (error) return <p className="message error">{error}</p>;

  return (
    <div className="product-list-page">
      <h1>Product List (Admin)</h1>

      {message && <div className={`message ${message.type}`}>{message.text}</div>}

      {products.length === 0 ? (
        <p>No products available.</p>
      ) : (
        <div className="product-list-grid">
          {products.map((product) => {
            const isEditing = editing === product._id;
            const isConfirming = confirming === product._id;

            return (
              <div
                key={product._id}
                className={`product-item ${isEditing ? "expanded" : ""}`}
              >
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

                {isEditing && (
                  <div className="expandable-content">
                    <div>
                      <label>Price: ₹</label>
                      <input
                        type="number"
                        value={editData.price}
                        onChange={(e) => handleEditChange("price", e.target.value)}
                      />
                    </div>
                    <div>
                      <label>Stock:</label>
                      <select
                        value={editData.stock}
                        onChange={(e) =>
                          handleEditChange("stock", e.target.value === "true")
                        }
                      >
                        <option value="true">In Stock</option>
                        <option value="false">Out of Stock</option>
                      </select>
                    </div>
                    <div className="confirm-buttons">
                      <button
                        className="confirm-yes"
                        onClick={() => handleUpdate(product._id)}
                      >
                        💾 Update
                      </button>
                      <button className="confirm-no" onClick={() => setEditing(null)}>
                        ❌ Cancel
                      </button>
                    </div>
                  </div>
                )}

                <div className="product-actions">
                  {!isEditing && !isConfirming && (
                    <>
                      <button onClick={() => handleEditInit(product)}>✏️ Edit</button>
                      <button
                        onClick={() => setConfirming(product._id)}
                      >
                        🗑 Delete
                      </button>
                    </>
                  )}
                </div>

                {isConfirming && !isEditing && (
                  <div className="confirm-inline">
                    <p>
                      Are you sure you want to delete <strong>{product.name}</strong>?
                    </p>
                    <div className="confirm-buttons">
                      <button
                        className="confirm-yes"
                        onClick={() => handleDelete(product._id)}
                      >
                        🗑 Delete
                      </button>
                      <button
                        className="confirm-no"
                        onClick={() => setConfirming(null)}
                      >
                        ❌ Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ProductList;