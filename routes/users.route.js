const express = require("express");
const userRoute = express.Router();
const { UserModel } = require("../model/user.model");
const {getUserById,getUserByEmail}=require("../middlewares/user.find")
userRoute
  .route("/signup")
  .post(async (req, res) => {
    let { name, password, email } = req.body;
    try {
      const newUser = new UserModel({
        name,
        password,
        email,
      });
      newUser.validateSync();
      const user = await getUserByEmail(email);
      if (user) {
        return res.json({
          success: false,
          message: "There is already user with this email",
        });
      }
      const addedUser = await newUser.save();
      addedUser.password=undefined;
      res.status(200).json({
        success: true,
        addedUser,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "failed to add user",
        error: err.message,
      });
    }
  });

userRoute.route("/login")
.get(async (req, res) => {
  const {
    headers: { email, password },
  } = req;
  try {
    const user = await getUserByEmail(email,"populated");
    if (!user) {
      res.status(500).json({
        success: false,
        message: "user does not exists",
      });
    }

    console.log(user.email,user.password, email, password);
    if(email===user.email&&password===user.password){
      user.password=undefined;
      res.status(200).json({
        success: true,
        message:"login success",
        user
      });
    }else{
      res.status(404).json({success:false,message:"user or password incorrect"})
    }
  } catch (err) {
    res.json({
      success: false,
      message: "user not found",
    });
  }

});
userRoute.param("userId", async (req, res, next, userId) => {
  try {
    const user = await getUserById(userId);
    res.json({message:"working"})
    req.user = user;
    next();
  } catch (err) {
    res.json({
      success: false,
      message: "user does not exists",
    });
  }
});
userRoute.route("/address/:userId")
.post(async (req, res) => {
  const { user } = req;
  const {address}=req.body;
  user.address=address;
  try{
    const response=  await user.save();
    response.password=undefined;
    res.status(200).json({
      success: true,
      response,
    });
  }catch(err){
    res.status(500).json({success:false,message:"unable to save address"})
  }


});
module.exports = userRoute;
