const Cart = require("../models/Cart");

exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    res.json(cart || { user: req.user._id, items: [] });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.saveCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = req.body.items;
      await cart.save();
    } else {
      cart = await Cart.create({ user: req.user._id, items: req.body.items });
    }
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.clearCart = async (req, res) => {
  try {
    await Cart.findOneAndDelete({ user: req.user._id });
    res.json({ message: "Cart cleared" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
