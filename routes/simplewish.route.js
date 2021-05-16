const express = require("express");
const simpleWishlistRoute = express.Router();
const { extend } = require("lodash");
const mongoose = require("mongoose");
const { wishList } = require("../model/wishlist.model");

simpleWishlistRoute
  .route("/")
  .get(async (req, res) => {
    try {
      let data = await wishList.find({});

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
      const newproduct = new wishList(data);
      newproduct.validateSync();
      const savedata = await newproduct.save();
      res.json({ success: true, data: data });
    } catch (err) {
      res.json({ success: false, message: err.message });
      console.log(err);
    }
  });
  simpleWishlistRoute.param("productId", async (req, res, next, productId) => {
  try {
    const product = await wishList.findById(productId);

    if (!product) {
      res
        .status(400)
        .json({ success: false, message: "unable to find  product" });
    }
    req.wishList = product;
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
simpleWishlistRoute
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
        const deletedList=await wishList.deleteOne({_id:uid},(err)=>{
            console.log("form error",err)
        });
        res.json({message:"new mss", success:true, deletedList});
    }
    catch(err){
        res.json({success:false,message:"unable to delete",err:err.message})
    }
  })

module.exports = simpleWishlistRoute;
