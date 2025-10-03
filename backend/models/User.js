const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    mobile: { type: String, required: true, unique: true },
    address: {
      houseNo: { type: String, default: "" },
      laneOrSector: { type: String, default: "" },
      landmark: { type: String, default: "" },
      pincode: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
