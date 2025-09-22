import { useCart } from "../context/CartContext";
import "../css/CartPage.css";
import { isUserLoggedIn } from "../utils/auth";
import { useNavigate } from "react-router-dom";

function CartPage() {
  const navigate = useNavigate();
  const loggedIn = isUserLoggedIn();
  const { cart, removeFromCart, clearCart } = useCart();

  if (!loggedIn) {
    navigate("/login");
    return null;
  }

  const DELIVERY = 20;
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal + DELIVERY;

  const placeOrder = () => {
    alert(`Order placed! Total: ₹${total}`);
    clearCart();
  };

  if (!cart.length)
    return (
      <div className="cart-empty">
        <p>Your cart is empty</p>
        <span>🛒 Add some veggies to place an order!</span>
      </div>
    );

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>
      <ul>
        {cart.map((item) => (
          <li key={item._id}>
            <div className="cart-item-left">
              {item.image && (
                <img
                  src={`${import.meta.env.VITE_API_URL}${item.image.startsWith("/uploads/") ? item.image : `/uploads/${item.image}`}`}
                  alt={item.name}
                  className="cart-item-img"
                />
              )}
              <span className="cart-item-name">{item.name}</span>
            </div>
            <div className="cart-item-right">
              <span className="cart-item-qty">
                {item.quantity}Kg × ₹{item.price} = ₹{(item.price * item.quantity).toFixed(2)}
              </span>
              <button className="delete-btn" onClick={() => removeFromCart(item._id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>

      <p>Subtotal: ₹{subtotal.toFixed(2)}</p>
      <p>Delivery: ₹{DELIVERY}</p>
      <h3>Total: ₹{total.toFixed(2)}</h3>
      <button onClick={placeOrder}>Place Order</button>
    </div>
  );
}

export default CartPage;
