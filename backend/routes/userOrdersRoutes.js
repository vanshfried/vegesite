const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const Order = require("../models/Order");

const router = express.Router();

// GET /api/users/orders
router.get("/", protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate("items.product", "name image price");
    res.json(orders);
  } catch (err) {
    console.error("Failed to fetch orders:", err);
    res.status(500).json({ message: "Server error fetching orders" });
  }
});

// PUT /api/users/orders/:id/cancel
router.put("/:id/cancel", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Only allow the user who placed the order to cancel it
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to cancel this order" });
    }

    // Only pending orders can be cancelled
    if (order.status !== "pending") {
      return res.status(400).json({ message: "Cannot cancel an order that is already confirmed or delivered" });
    }

    order.status = "cancelled";
    await order.save();
    res.json({ message: "Order cancelled successfully", order });
  } catch (err) {
    console.error("Error cancelling order:", err);
    res.status(500).json({ message: "Server error cancelling order" });
  }
});

module.exports = router;
