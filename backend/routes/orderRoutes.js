const express = require("express");
const Order = require("../models/Order");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

/* -------------------------------------------------------------------------- */
/*                                USER ROUTES                                */
/* -------------------------------------------------------------------------- */

// GET /api/orders/my-orders  ✅ user can fetch own orders
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

// POST /api/orders  ✅ place order
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

// PUT /api/orders/:id/cancel  ✅ user cancels own order
router.put("/:id/cancel", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized to cancel this order" });

    if (Date.now() - new Date(order.createdAt).getTime() > 3 * 60 * 1000)
      return res.status(403).json({ message: "Cancellation window expired" });

    if (order.status !== "processing")
      return res.status(403).json({ message: "Cannot cancel this order now" });

    order.status = "cancelled";
    await order.save();

    res.json({ message: "Order cancelled successfully", order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error cancelling order" });
  }
});

/* -------------------------------------------------------------------------- */
/*                               ADMIN ROUTES                                */
/* -------------------------------------------------------------------------- */

// GET /api/orders  ✅ all orders for admin
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const archivedFilter = req.query.archived === "true" ? {} : { archived: false };
    const orders = await Order.find(archivedFilter)
      .populate("user", "name mobile") // show phone number
      .populate("items.product", "name image price");
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching orders" });
  }
});

// GET /api/orders/:id  ✅ single order for admin
router.get("/:id", protect, adminOnly, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name mobile")
      .populate("items.product", "name image price");
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching order" });
  }
});

// PUT /api/orders/:id/status ✅ admin update
router.put("/:id/status", protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    if (!["processing", "out-for-delivery", "delivered", "cancelled"].includes(status))
      return res.status(400).json({ message: "Invalid status" });

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    await order.save();
    res.json({ message: "Order status updated", order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating status" });
  }
});

// PUT /api/orders/:id/delivery-time ✅ admin update delivery time
router.put("/:id/delivery-time", protect, adminOnly, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.deliveryTime = req.body.deliveryTime;
    await order.save();
    res.json({ message: "Delivery time updated", order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating delivery time" });
  }
});

// PUT /api/orders/clear-history ✅ admin archive
router.put("/clear-history", protect, adminOnly, async (req, res) => {
  try {
    const result = await Order.updateMany(
      { status: { $in: ["delivered", "cancelled"] }, archived: false },
      { $set: { archived: true } }
    );
    res.json({ message: "Orders archived", archivedCount: result.modifiedCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error archiving orders" });
  }
});

// DELETE /api/orders/:id ✅ admin delete
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

module.exports = router;
