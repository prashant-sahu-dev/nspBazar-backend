const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  passcode: {
    type: String,
    required: true,
  },
  address: {
    type: String,
  },
  image: {
    type: String,
  },
  ownerName: {
    type: String,
  },
  contact: {
    type: String,
  },
  // one shop has many items
  items: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
    }
  ]
});

module.exports = mongoose.model('Shop', shopSchema);
