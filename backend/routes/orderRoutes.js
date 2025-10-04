const express = require("express");
const Order = require("../models/Order");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

/* -------------------------------------------------------------------------- */
/*                                USER ROUTES                                  */
/* -------------------------------------------------------------------------- */

/**
 * GET /api/orders/my-orders
 * Fetch orders of the logged-in user
 */
router.get("/my-orders", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate("items.product", "name image price");

    res.json(orders);
  } catch (err) {
    console.error("Error fetching user orders:", err);
    res.status(500).json({ message: "Error fetching your orders" });
  }
});

/**
 * POST /api/orders
 * Place a new order
 */
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
      location: {
        type: "Point",
        coordinates: [location.longitude, location.latitude],
      },
      address,
      status: "processing",
    });

    await newOrder.save();
    res
      .status(201)
      .json({ message: "Order placed successfully", order: newOrder });
  } catch (err) {
    console.error("Error placing order:", err);
    res.status(500).json({ message: "Server error placing order" });
  }
});

/**
 * PUT /api/orders/:id/cancel
 * Cancel an order (within allowed time & only if processing)
 */
router.put("/:id/cancel", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.user.toString() !== req.user._id.toString())
      return res
        .status(403)
        .json({ message: "Not authorized to cancel this order" });

    if (Date.now() - new Date(order.createdAt).getTime() > 3 * 60 * 1000)
      return res.status(403).json({ message: "Cancellation window expired" });

    if (order.status !== "processing")
      return res.status(403).json({ message: "Cannot cancel this order now" });

    order.status = "cancelled";
    await order.save();

    res.json({ message: "Order cancelled successfully", order });
  } catch (err) {
    console.error("Error cancelling order:", err);
    res.status(500).json({ message: "Server error cancelling order" });
  }
});

/* -------------------------------------------------------------------------- */
/*                                ADMIN ROUTES                                 */
/* -------------------------------------------------------------------------- */

/**
 * GET /api/users-summary
 * Summary of all users with metrics (totalOrders, totalSpent, avgOrderValue)
 */
// GET /api/orders/users-summary — admin summary of users
router.get("/users-summary", protect, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "name mobile address");

    const summary = {};

    orders.forEach((order) => {
      if (!order.user) return;
      const id = order.user._id.toString();

      if (!summary[id]) {
        summary[id] = {
          user: order.user,
          totalOrders: 0,
          deliveredOrders: 0,
          cancelledOrders: 0,
          totalSpent: 0,
        };
      }

      summary[id].totalOrders += 1;

      if (order.status === "delivered") {
        summary[id].deliveredOrders += 1;
        summary[id].totalSpent += order.total || 0;
      }

      if (order.status === "cancelled") {
        summary[id].cancelledOrders += 1;
      }
    });

    const result = Object.values(summary).map((u) => ({
      ...u,
      avgOrderValue: u.deliveredOrders > 0 ? u.totalSpent / u.deliveredOrders : 0,
    }));

    res.json(result);
  } catch (err) {
    console.error("Error fetching users summary:", err);
    res.status(500).json({ message: "Error fetching summary" });
  }
});

/**
 * GET /api/users/:id/orders
 * Full order details for a specific user
 */
router.get("/users/:id/orders", protect, adminOnly, async (req, res) => {
  try {
    const filter = { user: req.params.id };
    if (req.query.archived === "true") filter.archived = true;

    const userOrders = await Order.find(filter)
      .populate("items.product", "name price image")
      .populate("user", "name mobile address");

    res.json(userOrders);
  } catch (err) {
    console.error("Error fetching user orders:", err);
    res.status(500).json({ message: "Error fetching user orders" });
  }
});

/**
 * GET /api/orders/users-orders
 * Grouped orders by users (full orders, for admin)
 */

/**
 * GET /api/orders
 * Get all orders (optionally archived)
 */
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const archivedFilter =
      req.query.archived === "true" ? {} : { archived: false };
    const orders = await Order.find(archivedFilter)
      .populate("user", "name mobile")
      .populate("items.product", "name image price");

    res.json(orders);
  } catch (err) {
    console.error("Error fetching all orders:", err);
    res.status(500).json({ message: "Error fetching orders" });
  }
});

/**
 * GET /api/orders/:id
 * Single order details for admin
 */
router.get("/:id", protect, adminOnly, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name mobile")
      .populate("items.product", "name image price");

    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    console.error("Error fetching single order:", err);
    res.status(500).json({ message: "Error fetching order" });
  }
});

/**
 * PUT /api/orders/:id/status
 * Update order status (admin)
 */
router.put("/:id/status", protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatus = [
      "processing",
      "out-for-delivery",
      "delivered",
      "cancelled",
    ];
    if (!validStatus.includes(status))
      return res.status(400).json({ message: "Invalid status" });

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    await order.save();

    res.json({ message: "Order status updated", order });
  } catch (err) {
    console.error("Error updating order status:", err);
    res.status(500).json({ message: "Error updating status" });
  }
});

/**
 * PUT /api/orders/:id/delivery-time
 * Update delivery time (admin)
 */
router.put("/:id/delivery-time", protect, adminOnly, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.deliveryTime = req.body.deliveryTime;
    await order.save();

    res.json({ message: "Delivery time updated", order });
  } catch (err) {
    console.error("Error updating delivery time:", err);
    res.status(500).json({ message: "Error updating delivery time" });
  }
});

/**
 * PUT /api/orders/clear-history
 * Archive delivered/cancelled orders
 */
router.put("/clear-history", protect, adminOnly, async (req, res) => {
  try {
    const result = await Order.updateMany(
      { status: { $in: ["delivered", "cancelled"] }, archived: false },
      { $set: { archived: true } }
    );

    res.json({
      message: "Orders archived",
      archivedCount: result.modifiedCount,
    });
  } catch (err) {
    console.error("Error archiving orders:", err);
    res.status(500).json({ message: "Error archiving orders" });
  }
});

/**
 * DELETE /api/orders/:id
 * Delete an order (admin)
 */
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    console.error("Error deleting order:", err);
    res.status(500).json({ message: "Error deleting order" });
  }
});

module.exports = router;
