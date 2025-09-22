const express = require("express");
const { registerAdmin, loginAdmin } = require("../controllers/adminAuthController");

const router = express.Router();

router.post("/register", registerAdmin); // no JWT needed
router.post("/login", loginAdmin);       // no JWT needed

module.exports = router;
