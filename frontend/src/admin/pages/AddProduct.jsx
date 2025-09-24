import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../../css/AddProduct.css";

function AddProduct() {
  const [formData, setFormData] = useState({ name: "", price: "", stock: true });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState(null); // ✅ success/error messages
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setMessage({ type: "error", text: "Please select a valid image file." });
      return;
    }

    setImage(file);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(file));
  };

  useEffect(() => {
    return () => { if (preview) URL.revokeObjectURL(preview); };
  }, [preview]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.price) {
      setMessage({ type: "error", text: "Name and price are required." });
      return;
    }

    const priceNum = parseFloat(formData.price);
    if (isNaN(priceNum) || priceNum < 0) {
      setMessage({ type: "error", text: "Price must be a non-negative number." });
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        setMessage({ type: "error", text: "Unauthorized. Please login as admin." });
        return;
      }

      const data = new FormData();
      data.append("name", formData.name);
      data.append("price", priceNum);
      data.append("stock", formData.stock ? "true" : "false");
      if (image) data.append("image", image);

      await axios.post(`${import.meta.env.VITE_API_URL}/api/products`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage({ type: "success", text: "Product added successfully!" });
      setFormData({ name: "", price: "", stock: true });
      setImage(null);
      setPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = null;
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: err.response?.data?.error || "Failed to add product." });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* ✅ Message box */}
      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <input name="name" placeholder="Product Name" value={formData.name} onChange={handleChange} required />
      <input name="price" type="number" min="0" step="1" placeholder="Price (₹)" value={formData.price} onChange={handleChange} required />

      <label>
        <input type="checkbox" name="stock" checked={formData.stock} onChange={handleChange} /> In Stock
      </label>

      <div className="image-container">
        <input type="file" accept="image/*" onChange={handleImageChange} ref={fileInputRef} required />
        {preview && <img src={preview} alt="Preview" />}
      </div>

      <button type="submit" disabled={!formData.name || !formData.price || !image}>Add Product</button>
    </form>
  );
}

export default AddProduct;
