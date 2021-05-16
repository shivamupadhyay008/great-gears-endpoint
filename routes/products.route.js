const express = require("express");
const products = express.Router();
const { Product } = require("../model/product.model");
const { extend } = require("lodash");

products
  .route("/")
  .get(async (req, res) => {
    try {
      let data = await Product.find({});

      res.json({ products: data });
    } catch (err) {
      console.log(err);
    }
  })
  .post(async (req, res) => {
    const {
      qnt,
      name,
      image,
      price,
      material,
      brand,
      inStock,
      fastDelivery,
      ratings,
    } = req.body;
    const data = {
      qnt,
      name,
      image,
      price,
      material,
      brand,
      inStock,
      fastDelivery,
      ratings,
    };
    try {
      const newproduct = new Product(data);
      newproduct.validateSync();
      const savedata = await newproduct.save();
      res.json({ success: true, data: data });
    } catch (err) {
      res.json({ success: false, message: err.message });
      console.log(err);
    }
  });
products.param("productId", async (req, res, next, productId) => {
  try {
    const product = await Product.findById(productId);

    if (!product) {
      res
        .status(400)
        .json({ success: false, message: "unable to find  product" });
    }
    req.product = product;
    next();
  } catch (err) {
    res
      .status(400)
      .json({
        success: false,
        message: "errow while retriving product",
        err: err.message,
      });
  }
});
products
  .route("/:productId")
  .get((req, res) => {
    let { product } = req;
    res.json({
      success: true,
      product,
    });
  })
  .post(async (req, res) => {
    const productUpadate = req.body;
    const { product } = req;
    const newproduct = extend(product, productUpadate);
    try {
      const updatedProduct = await newproduct.save();
      res.json({ updatedProduct });
      console.log();
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  });

module.exports = products;
