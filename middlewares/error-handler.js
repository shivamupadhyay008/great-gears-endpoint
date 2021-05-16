const error_handler = (err, req, res, next) => {
  res
    .status(500)
    .json({
      success: false,
      message: "internal server error something broke",
      error: err.message,
    });
  console.log(err.stack);
};
module.exports = error_handler;
