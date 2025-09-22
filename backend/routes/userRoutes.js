const express = require("express");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// User profile (accessible to logged-in users or admins)
router.get("/profile", protect, (req, res) => {
  res.json({
    message: "User profile fetched",
    user: req.user,
  });
});

module.exports = router;
