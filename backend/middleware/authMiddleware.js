// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (decoded.role === "admin") {
        req.user = await Admin.findById(decoded.id).select("-passwordHash");
      } else {
        req.user = await User.findById(decoded.id);
      }

      return next();
    } catch (err) {
      return res.status(401).json({ error: "Not authorized, token failed" });
    }
  }

  if (!token) return res.status(401).json({ error: "Not authorized, no token" });
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") return next();
  return res.status(403).json({ error: "Admins only" });
};

module.exports = { protect, adminOnly };
