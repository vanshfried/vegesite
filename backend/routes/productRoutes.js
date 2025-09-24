const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { createProduct, getAllProducts, deleteProduct, updateProduct } = require('../controllers/productController');

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Ensure 'uploads/' folder exists
  },
  filename: (req, file, cb) => {
    // Sanitize product name from request body
    const safeName = req.body.name
      ? req.body.name.replace(/\s+/g, '_').toLowerCase()
      : 'product';

    // Append timestamp to avoid overwriting files with same name
    const timestamp = Date.now();
    cb(null, `${safeName}_${timestamp}${path.extname(file.originalname)}`);
  }
});

// File filter to allow only images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only images are allowed (jpeg, jpg, png, gif)'));
  }
};

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max file size
  fileFilter: fileFilter
});

// Routes
router.post('/', upload.single('image'), createProduct); // Create product
router.get('/', getAllProducts);                         // Get all products
router.delete('/:id', deleteProduct);                    // Delete product by ID
router.put('/:id', updateProduct);
module.exports = router;
