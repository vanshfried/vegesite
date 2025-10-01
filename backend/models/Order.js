// models/Order.js
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        name: String,
        price: Number,
        quantity: Number,
      },
    ],
    subtotal: Number,
    deliveryFee: Number,
    total: Number,
    location: {
      type: { type: String },
      coordinates: [Number],
    },
    address: String,
    status: {
      type: String,
      enum: ["processing", "out-for-delivery", "delivered", "cancelled"],
      default: "processing",
    },
    deliveryTime: Date,
    archived: { type: Boolean, default: false }, // ✅ new field
  },
  { timestamps: true }
);

orderSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Order", orderSchema);
