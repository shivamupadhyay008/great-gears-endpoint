const express = require("express");
const simpleCartRoute = express.Router();
const { extend } = require("lodash");
const mongoose = require("mongoose");
const { Cart } = require("../model/cart.model");

simpleCartRoute
  .route("/")
  .get(async (req, res) => {
    try {
      let data = await Cart.find({});

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
    console.log(req.body)
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
      const newproduct = new Cart(data);
      newproduct.validateSync();
      const savedata = await newproduct.save();
      res.json({ success: true, data: data });
    } catch (err) {
      res.json({ success: false, message: err.message });
      console.log(err);
    }
  });
  simpleCartRoute.param("productId", async (req, res, next, productId) => {
  try {
    const product = await Cart.findById(productId);

    if (!product) {
      res
        .status(400)
        .json({ success: false, message: "unable to find  product" });
    }
    req.Cart = product;
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
simpleCartRoute
  .route("/:productId")
  .get((req, res) => {
    let { product } = req;
    res.json({
      success: true,
      message:"form msss",
      product
    });
  })
  .delete(async(req,res)=>{
console.log(req.params.productId)

    let uid=mongoose.Types.ObjectId(req.params.productId);
    console.log(uid)
    let product=req.product;
    try{
        // throw new Error("Throwing error")
        const deletedList=await Cart.deleteOne({_id:uid},(err)=>{
            console.log("form error",err)
        });
        res.json({message:"new mss", success:true, deletedList});
    }
    catch(err){
        res.json({success:false,message:"unable to delete",err:err.message})
    }
  })

module.exports = simpleCartRoute;
