const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const Order = require("../models/Order");

const router = express.Router();

// GET /api/users/orders — fetch user's own orders
router.get("/", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate("items.product", "name image price");
    res.json(orders);
  } catch (err) {
    console.error("Failed to fetch orders:", err);
    res.status(500).json({ message: "Server error fetching orders" });
  }
});

// PUT /api/users/orders/:id/cancel — cancel an order within 3 min
router.put("/:id/cancel", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to cancel this order" });
    }

    if (order.status !== "processing") {
      return res
        .status(400)
        .json({ message: "Cannot cancel delivered or already cancelled orders" });
    }

    // Only allow cancellation within 3 minutes
    const createdTime = new Date(order.createdAt).getTime();
    if (Date.now() - createdTime > 3 * 60 * 1000) {
      return res
        .status(400)
        .json({ message: "Cancellation window expired. Cannot cancel this order." });
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
