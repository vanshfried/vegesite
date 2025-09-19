const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Product name is required'], 
    trim: true 
  },
  price: { 
    type: Number, 
    required: [true, 'Product price is required'], 
    min: [0, 'Price cannot be negative'] 
  },
  stock: { 
    type: Boolean, 
    default: true 
  },
  image: { 
    type: String, 
    match: [/^\/uploads\/.+$/, 'Image path must be in /uploads folder'] 
  },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
