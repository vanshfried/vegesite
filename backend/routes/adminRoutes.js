const express = require("express");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const User = require("../models/User");
const Admin = require("../models/Admin");

const router = express.Router();

// Current admin info
router.get("/me", protect, adminOnly, (req, res) => {
  res.json({
    message: "Admin profile",
    admin: req.user,
  });
});

// List all users
router.get("/all-users", protect, adminOnly, async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// List all admins
router.get("/all-admins", protect, adminOnly, async (req, res) => {
  const admins = await Admin.find().select("-passwordHash");
  res.json(admins);
});

// Delete a user
router.delete("/user/:id", protect, adminOnly, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete user" });
  }
});

module.exports = router;
