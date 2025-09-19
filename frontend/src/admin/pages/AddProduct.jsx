import { useState, useEffect } from "react";
import axios from "axios";

function AddProduct() {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: true, // Boolean matches backend
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }

    setImage(file);

    // Cleanup previous preview
    if (preview) URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(file));
  };

  // Cleanup preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      alert("Name and price are required.");
      return;
    }

    const priceNum = parseFloat(formData.price);
    if (isNaN(priceNum) || priceNum < 0) {
      alert("Price must be a non-negative number.");
      return;
    }

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("price", priceNum);
      data.append("stock", formData.stock ? "true" : "false");

      if (image) data.append("image", image);

      await axios.post(`${import.meta.env.VITE_API_URL}/api/products`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Product added successfully!");
      setFormData({ name: "", price: "", stock: true });
      setImage(null);
      setPreview(null);
    } catch (err) {
      console.error(err);
      alert("Failed to add product.");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "400px" }}>
      <input
        name="name"
        placeholder="Product Name"
        value={formData.name}
        onChange={handleChange}
        required
      />

      <input
        name="price"
        type="number"
        min="0"
        step="1"
        placeholder="Price (₹)"
        value={formData.price}
        onChange={handleChange}
        required
      />

      <label>
        <input
          type="checkbox"
          name="stock"
          checked={formData.stock}
          onChange={handleChange}
        />
        In Stock
      </label>

      <input type="file" accept="image/*" onChange={handleImageChange} required />

      {preview && (
        <img
          src={preview}
          alt="Preview"
          style={{ width: "150px", marginTop: "10px", borderRadius: "8px" }}
        />
      )}

      <button
        type="submit"
        disabled={!formData.name || !formData.price}
        style={{ marginTop: "10px" }}
      >
        Add Product
      </button>
    </form>
  );
}

export default AddProduct;
