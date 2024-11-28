const { StatusCodes } = require("http-status-codes");

const validateProduct = (req, res, next) => {
  if (!req.body.name || !req.body.price || !req.body.category) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      data: {},
      succes: false,
      message: "Name, price, and category are required",
      err: "Missing Mandatory field to create a product",
    });
  }

  if (isNaN(req.body.price)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      data: {},
      succes: false,
      message: "Invalid Price value",
      error: "Price must be a valid number",
    });
  }
  next();
};

module.exports = validateProduct;
