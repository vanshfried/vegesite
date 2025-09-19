import { useState } from "react";
import "../css/ProductCard.css";

function ProductCard({ product, onBuy }) {
  const [quantity, setQuantity] = useState(1); // default 1kg for display/input

  const MIN_QTY = 0.1; // 0.1 kg = 100g
  const MAX_QTY = 25;  // 25 kg

  // Generate full image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";
    return `${import.meta.env.VITE_API_URL}${
      imagePath.startsWith("/uploads/") ? imagePath : `/uploads/${imagePath}`
    }`;
  };

  const handleBuy = () => {
    let finalQty = Number(quantity);
    if (finalQty < MIN_QTY) finalQty = MIN_QTY;
    if (finalQty > MAX_QTY) finalQty = MAX_QTY;

    if (onBuy) onBuy(product, finalQty * 1000); // convert kg to grams
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
            step={0.5} // step of 50g
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
          <span>Kg</span>
          <button className="buy-btn" onClick={handleBuy}>
            Buy
          </button>
        </div>
      ) : (
        <p className="out-of-stock">Out of Stock</p>
      )}
    </div>
  );
}

export default ProductCard;
