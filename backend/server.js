const express = require("express");
const cors = require("cors");
require("dotenv").config();
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
const cartRoutes = require("./routes/cartRoutes");

const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/cart", cartRoutes);
// Test route
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// Product routes
app.use("/api/products", require("./routes/productRoutes"));

// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 🔹 Auth routes
app.use("/auth/user", require("./routes/userAuthRoutes"));
app.use("/auth/admin", require("./routes/adminAuthRoutes"));

// 🔹 Protected routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

// DB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
