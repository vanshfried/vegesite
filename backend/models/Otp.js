// models/Otp.js
const mongoose = require("mongoose");

const OtpSchema = new mongoose.Schema(
  {
    mobile: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 300 }, // auto delete after 5 minutes
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Otp", OtpSchema);
