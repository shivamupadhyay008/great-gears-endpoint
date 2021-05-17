const express = require("express");
const wishlistRoute = express.Router();
const {
  getUserById
} = require("../middlewares/user.find")
wishlistRoute.param("userId", async (req, res, next, userId) => {
  try {
    const user = await getUserById(userId,"wishlist");
    req.user = user;
    next();
  } catch (err) {
    res.json({
      success: false,
      message: "user does not exists"
    });
  }
});
wishlistRoute.route("/:userId")
  .get(async (req, res) => {
    try {
      const user = req.user;
      const { wishlist } = await user;


      let newWishlist=wishlist.map((item) => {
        let items = item.productId;
        return { ...items._doc, qnt: item.qnt };
      })

      res.json({
        success: true,
        wishlist:newWishlist
      });
    } catch (err) {
      res.json({
        success: false,
        message: "unable to get wishlist"
      });
    }
  })

  .post(async (req, res) => {
    const { productId } = req.body;
    try {
      const user =req.user;
      let {wishlist}=user;
      let present = wishlist.find(
        (item) => item.productId == productId);
      console.log(present)
        if (!present) {
        const newWishlist= { productId: productId };
        user.wishlist.push(newWishlist);
        await user.save();
        res.json({ success: true, message:"added successfully" });
      }
      res.json({success:true,message:"added to wishlist"})
    } catch (err) {
      console.log(err);
      res.json({ success: false, message: err });
    }
  });


module.exports = wishlistRoute;