const mongoose = require("mongoose");

const db_init = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://shivam008:shivam1234@shivamscluster.fczwx.mongodb.net/e-com",
      { useNewUrlParser: true, useUnifiedTopology: true }
    );
    console.log("connected succesfully with database");
  } catch (err) {
    console.log("erro from db", err.message);
  }
};

module.exports = db_init;
