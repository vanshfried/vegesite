const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  name: String,
  price: Number,
  quantity: Number,
});

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [orderItemSchema],
    subtotal: { type: Number, required: true },
    deliveryFee: { type: Number, required: true },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "out-for-delivery", "delivered", "cancelled"],
      default: "pending",
    },
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], required: true }, // [lng, lat]
    },
    address: {
      street: String,
      city: String,
      state: String,
      zip: String,
      country: String,
    },
    deliveryTime: { type: Date },
  },
  { timestamps: true }
);

orderSchema.index({ location: "2dsphere" }); // Geo queries support

module.exports = mongoose.model("Order", orderSchema);
