const Product = require('../models/Product');
const path = require('path');

// Create new product with single image upload
exports.createProduct = async (req, res) => {
  try {
    // Handle image path
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    // Validate price
    const price = parseFloat(req.body.price);
    if (isNaN(price) || price < 0) {
      return res.status(400).json({ error: 'Invalid price' });
    }

    // Create product
    const product = await Product.create({
      name: req.body.name,
      price: price,
      stock: req.body.stock === 'true', // Boolean conversion
      image: imagePath,
    });

    res.status(201).json(product);
  } catch (err) {
    // Better error handling
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete a product by ID
exports.deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
// Update a product by ID
exports.updateProduct = async (req, res) => {
  try {
    const { price, stock } = req.body;

    // Validate price if provided
    if (price !== undefined) {
      const priceNum = parseFloat(price);
      if (isNaN(priceNum) || priceNum < 0) {
        return res.status(400).json({ error: 'Invalid price' });
      }
      req.body.price = priceNum;
    }

    // Validate stock if provided
    if (stock !== undefined) {
      req.body.stock = stock === true || stock === 'true';
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json(updatedProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
