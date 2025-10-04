// controllers/userController.js
const User = require("../models/User");

// @desc    Get logged-in user's profile
// @route   GET /api/users/profile
// @access  Private (User/Admin)
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id); // always fetch fresh
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ user });
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// @desc    Update logged-in user's profile (name, address, etc.)
// @route   PUT /api/users/profile
// @access  Private (User)
exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Only allow specific fields to be updated
    if (req.body.name !== undefined) user.name = req.body.name;

    if (req.body.address) {
      user.address = {
        houseNo: req.body.address.houseNo || user.address.houseNo,
        laneOrSector: req.body.address.laneOrSector || user.address.laneOrSector,
        landmark: req.body.address.landmark || user.address.landmark,
        pincode: req.body.address.pincode || user.address.pincode,
      };
    }

    const updatedUser = await user.save();
    res.json({ message: "Profile updated", user: updatedUser });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
