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
    next();
  } catch (err) {
    res.json({
      success: false,
      message: "user does not exists",
    });
  }
});
wishlistRoute
  .route("/:userId")
  .get(async (req, res) => {
    try {
      const wishlist = req.wishlist;
      res.json({
        success: true,
        wishlist
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
  });
module.exports = wishlistRoute;
