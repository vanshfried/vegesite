const fs = require("fs").promises;
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config();
const Product = require("./models/Product"); // adjust path if needed

const UPLOADS_DIR = path.join(__dirname, "uploads");

async function cleanupUploads() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    // Get list of all image files in uploads folder
    const files = await fs.readdir(UPLOADS_DIR);

    // Get list of all images referenced in the DB
    const products = await Product.find({}, "image");
    const imagePathsInDB = products
      .map((p) => p.image)
      .filter(Boolean)
      .map((img) => path.basename(img)); // only filename

    // Delete files that are not in DB
    for (const file of files) {
      if (!imagePathsInDB.includes(file)) {
        const filePath = path.join(UPLOADS_DIR, file);
        await fs.unlink(filePath);
        console.log(`Deleted orphan image: ${file}`);
      }
    }

    console.log("Cleanup complete");
    process.exit(0);
  } catch (err) {
    console.error("Error during cleanup:", err);
    process.exit(1);
  }
}

cleanupUploads();
