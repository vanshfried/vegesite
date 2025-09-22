const express = require("express");
const Cart = require("../models/Cart");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Get logged-in user cart
router.get("/", protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
    const items = (cart?.items || []).map(i => ({
      _id: i.product._id,
      name: i.product.name,
      price: i.product.price,
      image: i.product.image,
      quantity: i.quantity
    }));
    res.json({ items });
  } catch (err) {
    console.error("Failed to fetch cart:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Add or update cart items (bulk)
router.post("/", protect, async (req, res) => {
  try {
    const { items } = req.body; // expecting array: [{ productId, quantity }, ...]
    if (!Array.isArray(items)) return res.status(400).json({ message: "Items must be an array" });

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = new Cart({ user: req.user._id, items: [] });

    cart.items = items.map((item) => ({
      product: item.productId,
      quantity: item.quantity,
    }));

    await cart.save();
    const populatedCart = await cart.populate("items.product");
    const responseItems = populatedCart.items.map(i => ({
      _id: i.product._id,
      name: i.product.name,
      price: i.product.price,
      image: i.product.image,
      quantity: i.quantity
    }));

    res.json({ items: responseItems });
  } catch (err) {
    console.error("Cart save error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Remove a single item
router.delete("/:productId", protect, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter((i) => i.product.toString() !== req.params.productId);
    await cart.save();

    const populatedCart = await cart.populate("items.product");
    const responseItems = populatedCart.items.map(i => ({
      _id: i.product._id,
      name: i.product.name,
      price: i.product.price,
      image: i.product.image,
      quantity: i.quantity
    }));

    res.json({ items: responseItems });
  } catch (err) {
    console.error("Failed to remove item:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Clear cart
router.delete("/", protect, async (req, res) => {
  try {
    await Cart.findOneAndDelete({ user: req.user._id });
    res.json({ message: "Cart cleared" });
  } catch (err) {
    console.error("Failed to clear cart:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
