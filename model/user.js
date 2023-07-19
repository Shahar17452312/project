const mongoose = require('mongoose');
const autopopulate = require('mongoose-autopopulate');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  address: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  cart: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'cake'
    },
    quantity: {
      type: Number,
      default: 1
    }
  }]
});
userSchema.plugin(autopopulate);
const User = mongoose.model('User', userSchema);
module.exports = User;
