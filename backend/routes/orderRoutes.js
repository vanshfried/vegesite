const express = require("express");
const Order = require("../models/Order");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// 📌 Place new order (user)
router.post("/", protect, async (req, res) => {
  const { cart, subtotal, deliveryFee, total, location, address } = req.body;
  try {
    if (!location?.latitude || !location?.longitude) {
      return res.status(400).json({ message: "Location required" });
    }

    const newOrder = new Order({
      user: req.user._id,
      items: cart.map((item) => ({
        product: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      subtotal,
      deliveryFee,
      total,
      location: { type: "Point", coordinates: [location.longitude, location.latitude] },
      address,
      status: "processing",
    });

    await newOrder.save();
    res.status(201).json({ message: "Order placed successfully", order: newOrder });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error placing order" });
  }
});

// 📌 User cancels own order
router.put("/:id/cancel", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "You are not authorized to cancel this order" });

    const createdTime = new Date(order.createdAt).getTime();
    if (Date.now() - createdTime > 3 * 60 * 1000) {
      return res.status(403).json({ message: "Cancellation window expired. Cannot cancel this order." });
    }

    if (order.status !== "processing")
      return res.status(403).json({ message: "Cannot cancel orders that are out-for-delivery, delivered, or already cancelled" });

    order.status = "cancelled";
    await order.save();

    res.json({ message: "Order cancelled successfully", order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error cancelling order" });
  }
});

// 📌 Admin: update order status
router.put("/:id/status", protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ["processing", "out-for-delivery", "delivered", "cancelled"];
    if (!allowed.includes(status)) return res.status(400).json({ message: "Invalid status" });

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    await order.save();
    res.json({ message: "Order status updated successfully", order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating order status" });
  }
});

// 📌 Admin: update delivery time
router.put("/:id/delivery-time", protect, adminOnly, async (req, res) => {
  try {
    const { deliveryTime } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.deliveryTime = deliveryTime;
    await order.save();
    res.json({ message: "Delivery time updated successfully", order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating delivery time" });
  }
});

// 📌 Admin: archive delivered/cancelled orders
router.put("/clear-history", protect, adminOnly, async (req, res) => {
  try {
    const result = await Order.updateMany(
      { status: { $in: ["delivered", "cancelled"] }, archived: false },
      { $set: { archived: true } }
    );

    res.json({
      message: "Delivered and cancelled orders archived successfully",
      archivedCount: result.modifiedCount,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error archiving order history" });
  }
});

// 📌 Admin: delete order permanently
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting order" });
  }
});

// 📌 Admin: get all orders (exclude archived by default)
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const archivedFilter = req.query.archived === "true" ? {} : { archived: false };

    const orders = await Order.find(archivedFilter)
      .populate("user", "name email")
      .populate("items.product", "name image price");

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching all orders" });
  }
});

// 📌 Admin: get single order
router.get("/:id", protect, adminOnly, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("items.product", "name image price");
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching order" });
  }
});

// 📌 User: get own orders
router.get("/my-orders", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate("items.product", "name image price");
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching your orders" });
  }
});

module.exports = router;
