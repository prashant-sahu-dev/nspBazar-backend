const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: String,
  mrp: Number,
  price: Number,
  weight: String,
  image: String,

  // item belongs to which shop?
  shopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    required: true,
  }
});

module.exports = mongoose.model('Item', itemSchema);
