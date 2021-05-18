const express = require("express");
const cartRoute = express.Router();
const { UserModel } = require("../model/user.model");
const { extend } = require("lodash");
const { getUserById } = require("../middlewares/user.find");

cartRoute.param("userId", async (req, res, next, userId) => {
  try {
    console.log("before", userId);
    const user = await getUserById(userId, "cart");
    req.user = user;
    next();
  } catch (err) {
    res.json({
      success: false,
      message: "user does not exists",
    });
  }
});
cartRoute
  .route("/:userId")
  .get(async (req, res) => {
    try {
      const user = req.user;
      const { cart } = user;
      let newCart=cart.map((item) => {
        let items = item.productId;
        return { ...items._doc, qnt: item.qnt };
      })
      res.json({
        success: true,
        cart:newCart,
      });
    } catch (err) {
      res.json({
        success: false,
        message: "unable to get cart",
      });
    }
  })
  .post(async (req, res) => {
    const { userId } = req.params;
    const { productId, qnt } = req.body;

    try {
      const user = await getUserById(userId);
      let { cart } = user;

      let present = cart.find((item) => item.productId == productId);
      if (present) {
        let updateQnt = { productId, qnt };
        present = extend(present, updateQnt);
        cart = cart.map((item) => {
          return item.productId == productId ? present : item;
        });
        user.cart = cart;
        let respo = await user.save();
        return res.json({ respo });
      } else {
        const newCartItem = { productId: productId, qnt: qnt ?? 1 };
        user.cart.push(newCartItem);
        await user.save();
        res.json({ success: true, user });
      }
    } catch (err) {
      console.log(err);
      res.json({ success: false, message: err });
    }
  })
  .delete(async (req, res) => {
    const { userId } = req.params;
    const { productId, qnt } = req.body;

    try {
      const user = await getUserById(userId);
      let { cart } = user;

      let present = cart.find((item) => item.productId == productId);
      if (present) {
        let updateQnt = { productId, qnt };
        present = extend(present, updateQnt);
        cart = cart.filter((item) => {
          return item.productId != productId;
        });
        user.cart = cart;
        let respo = await user.save();
        console.log(respo)
        return res.json({ respo });
      } else {
        res.json({ success: true, user });
      }
    } catch (err) {
      console.log(err);
      res.json({ success: false, message: err });
    }
  })

module.exports = cartRoute;
