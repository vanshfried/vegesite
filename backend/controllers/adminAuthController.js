const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: "All fields required" });

    const existing = await Admin.findOne({ email });
    if (existing) return res.status(400).json({ error: "Email already registered" });

    const passwordHash = await bcrypt.hash(password, 10);

    const admin = await Admin.create({ name, email, passwordHash });

    res.json({ 
      message: "Admin registered", 
      admin,
      token: generateToken(admin._id, admin.role), // issue JWT right away
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to register admin" });
  }
};

exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    res.json({
      message: "Login successful",
      admin,
      token: generateToken(admin._id, admin.role), // ✅ real JWT now
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to login" });
  }
};
