const mongoose = require("mongoose");
require("mongoose-type-url");
const { Schema } = mongoose;

const productSchema = new Schema(
  {
    qnt: {
      type: Number,
      required: [true, "qnt is not provided"],
    },
    name: {
      type: String,
      required: [true, "Name required"],
    },
    image: {
      type: mongoose.SchemaTypes.Url,
      required: [true, "image is not provided"],
    },
    price: {
      type: Number,
      required: [true, "price is not provided"],
    },
    material: {
      type: String,
      required: [true, "material is not provided"],
    },
    brand: {
      type: String,
      required: [true, "brand is not provided"],
    },
    inStock: {
      type: Boolean,
      required: [true, "availabilty is not provided"],
    },
    fastDelivery: {
      type: Boolean,
      required: [true, "delivery type is not provided"],
    },
    ratings: {
      type: Number,
      required: [true, "ratings is not provided"],
    },
  },
  {
    timestamps: true,
  }
);
const Product = mongoose.model("product", productSchema);

module.exports = { Product };
