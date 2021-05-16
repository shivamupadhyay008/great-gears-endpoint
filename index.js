const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const error_handler = require("./middlewares/error-handler");
const route_handler = require("./middlewares/route-error-handler");
const mongoose = require("mongoose");
const products = require("./routes/products.route");
const userRoute = require("./routes/users.route");
const cartRoute = require("./routes/cart.route");
const wishlistRoute = require("./routes/wishlist.route");
const simpleWishlistRoute = require("./routes/simplewish.route");
const simpleCartRoute = require("./routes/simplecart.route");
const db_init = require("./db/db.connection");

const app = express();
db_init();
app.use(bodyParser.json());
app.use(cors());
app.use("/products", products);
app.use("/users", userRoute);
app.use("/cart", cartRoute);
app.use("/wishlist", wishlistRoute);
app.use("/simplewishlist", simpleWishlistRoute);
app.use("/simplecart", simpleCartRoute);

  app.get("/", (req, res) => {
    res.json({
      success: true,
      message: "welcome to great gear end point",
    });
  });
  app.use(route_handler);
  app.use(error_handler);
  const PORT = 3100;
  app.listen(process.env.PORT||PORT, () => {
    console.log("server started for great gear on port " + PORT);
  });
