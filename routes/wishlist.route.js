const express = require("express");
const wishlistRoute = express.Router();
const { getUserById } = require("../middlewares/user.find");
wishlistRoute.param("userId", async (req, res, next, userId) => {
  try {
    const user = await getUserById(userId, "wishlist");
    req.user = user;
    const { wishlist } = user;
    const newWishlist = wishlist.map((item) => {
      let items = item.productId;
      return { ...items._doc };
    });
    req.wishlist = newWishlist;

  } catch (err) {
    res.json({
      success: false,
      message: "user does not exists",
    });
  }
  next();
});
wishlistRoute
  .route("/:userId")
  .get(async (req, res) => {
    try {
      const wishlist = req.wishlist;
      res.json({
        success: true,
        wishlist,
      });
    } catch (err) {
      res.json({
        success: false,
        message: "unable to get wishlist",
      });
    }
  })
  .post(async (req, res) => {
    const { productId } = req.body;
    console.log(productId);
    try {
      const user = req.user;
      let wishlist = req.wishlist;
      let present = wishlist.find((item) => item._id == productId);
      console.log(present);
      if (!present) {
        const newWishlist = { productId: productId };
        user.wishlist.push(newWishlist);
        await user.save();
        res.json({ success: true, message: "added successfully" });
      }
      res.json({ success: true, message: "already in wishlist" });
    } catch (err) {
      console.log(err);
      res.json({ success: false, message: err });
    }
  })
  .delete(async (req, res) => {
    req.user=undefined;
    req.wishlist=undefined;
    const { userId} = req.params;
    const {productId}=req.body;
    console.log(userId,productId)
    try {
      const user = await getUserById(userId);
      let wishlist = user.wishlist;
      let present = wishlist.find((item) => item.productId == productId);
      if (present) {
        const list = wishlist.filter((item) => {
          return item.productId != productId;
        });
        user.wishlist=list;
        await user.save();
        res.json({ success: true, message: "deleted successfully" });
      }
    } catch (err) {
      console.log(err);
      res.json({ success: false, message: err });
    }
    res.status(404).json({success:false,message:"unable to delete"})
  });
module.exports = wishlistRoute;
