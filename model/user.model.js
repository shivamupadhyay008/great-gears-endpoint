const mongoose = require('mongoose');
require('mongoose-type-url');
const {Schema} = mongoose;
const {  Product } = require("./product.model")

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name required"]
  },
  email: {
    type: String,
    required: [true, "Email is not provided"],
    unique: true,
    index: true
  },
  password: {
    type: String,
    required: [true, "password is not provided"]
  },
  address: {
    type: String,
  },
  wishlist: [{
    productId: {
      type: Schema.Types.ObjectId,
      ref: "product"
    }
  }],
  cart: [{
    productId: {
      type: Schema.Types.ObjectId,
      ref: "product"

    },
    qnt: {
      type: Number
    }

  }],
}, {
  timestamps: true
});

const UserModel = mongoose.model("user", userSchema);

module.exports = {
  UserModel
};