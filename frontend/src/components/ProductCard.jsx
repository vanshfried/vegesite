import { useState } from "react";
import { useCart } from "../context/CartContext";
import "../css/ProductCard.css";
import { useNavigate } from "react-router-dom";

function ProductCard({ product }) {
  const [quantity, setQuantity] = useState(1);
  const { setCartItemQuantity } = useCart(); // use the replace function
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const MIN_QTY = 0.1;
  const MAX_QTY = 25;

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";
    return `${import.meta.env.VITE_API_URL}${
      imagePath.startsWith("/uploads/") ? imagePath : `/uploads/${imagePath}`
    }`;
  };

  const handleAdd = () => {
    let finalQty = Number(quantity);
    if (finalQty < MIN_QTY) finalQty = MIN_QTY;
    if (finalQty > MAX_QTY) finalQty = MAX_QTY;

    // Use setCartItemQuantity to replace quantity instead of adding
    setCartItemQuantity(product, finalQty);

    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000);
  };

  return (
    <div className={`product-card ${!product.stock ? "out-of-stock" : ""}`}>
      <h2 className="product-name">{product.name}</h2>

      {product.image ? (
        <img
          className="product-image"
          src={getImageUrl(product.image)}
          alt={product.name}
        />
      ) : (
        <div className="product-image placeholder">No Image</div>
      )}

      <p className="product-price">Price: ₹{product.price} / Kg</p>

      {product.stock ? (
        <div className="buy-section">
          <input
            type="number"
            min={MIN_QTY}
            max={MAX_QTY}
            step={0.5}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
          <span>Kg</span>
          <button className="buy-btn" onClick={handleAdd}>
            Add to Cart
          </button>
        </div>
      ) : (
        <p className="out-of-stock">Out of Stock</p>
      )}

      {/* Popup */}
      {showPopup && (
        <div className="cart-popup">
          <p>{product.name} added to cart!</p>
          <button onClick={() => navigate("/cart")}>Go to Cart</button>
        </div>
      )}
    </div>
  );
}

export default ProductCard;
