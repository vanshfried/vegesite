import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import "../css/ProductCard.css";
import { useNavigate } from "react-router-dom";
import { isUserLoggedIn } from "../utils/auth";

function ProductCard({ product }) {
  const [quantity, setQuantity] = useState(1);
  const { setCartItemQuantity } = useCart();
  const [popup, setPopup] = useState({ message: "", type: "" });
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const MIN_QTY = 0.25;
  const MAX_QTY = 25;

  const getImageUrl = (imagePath) =>
    imagePath
      ? `${import.meta.env.VITE_API_URL}${imagePath.startsWith("/uploads/") ? imagePath : `/uploads/${imagePath}`}`
      : "";

  const handleAdd = () => {
    if (!isUserLoggedIn()) {
      setPopup({ message: "Please login to add items to cart.", type: "login" });
      setShowPopup(true);
      return;
    }

    let finalQty = Number(quantity);
    if (finalQty < MIN_QTY) finalQty = MIN_QTY;
    if (finalQty > MAX_QTY) finalQty = MAX_QTY;

    setCartItemQuantity(product, finalQty);
    setPopup({ message: `${product.name} added to cart!`, type: "cart" });
    setShowPopup(true);
  };

  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => setShowPopup(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showPopup]);

  return (
    <div className={`product-card ${!product.stock ? "out-of-stock" : ""}`}>
      <h2 className="product-name">{product.name}</h2>
      {product.image ? (
        <img className="product-image" src={getImageUrl(product.image)} alt={product.name} />
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
          <button className="buy-btn" onClick={handleAdd}>Add to Cart</button>
        </div>
      ) : (
        <p className="out-of-stock">Out of Stock</p>
      )}

      {showPopup && (
        <div className={`cart-popup ${popup.type}`}>
          <p>{popup.message}</p>
          {popup.type === "cart" && <button onClick={() => navigate("/cart")}>Go to Cart</button>}
          {popup.type === "login" && <button onClick={() => navigate("/login")}>Go to Login</button>}
        </div>
      )}
    </div>
  );
}

export default ProductCard;
