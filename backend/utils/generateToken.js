const jwt = require("jsonwebtoken");

const generateToken = (id, role) => {
  const expiresIn = role === "admin" ? "7d" : "1d"; // 7 days for admin, 1 day for user
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn });
};

module.exports = generateToken;
