const { StatusCodes } = require("http-status-codes");

const { ProductService } = require("../services/index");

const productService = new ProductService();

class ProductController {
  async create(req, res) {
    try {
      const { name, price, description, category } = req.body;

      const product = await productService.create({
        name,
        price,
        description,
        category,
      });
      return res.status(StatusCodes.CREATED).json({
        data: product,
        success: true,
        message: "Successfully created product.",
        err: {},
      });
    } catch (error) {
      return res
        .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          success: false,
          data: {},
          message: error.message || "Failed to create product.",
          err: error.explanation || error,
        });
    }
  }

  async get(req, res) {
    try {
      const { id } = req.params;
      const product = await productService.get(id);
      return res.status(StatusCodes.OK).json({
        data: product,
        success: true,
        message: "Successfully fetch product.",
        err: {},
      });
    } catch (error) {
      return res
        .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          success: false,
          data: {},
          message: error.message || "Failed to fetch product.",
          err: error.explanation || error,
        });
    }
  }

  async update(req, res) {
    try {
      const { name, price, description, category } = req.body;
      const { id } = req.params;

      const product = await productService.update(
        { name, price, description, category },
        id
      );
      return res.status(StatusCodes.OK).json({
        data: product,
        success: true,
        message: "Successfully updated the product.",
        err: {},
      });
    } catch (error) {
      return res
        .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          success: false,
          data: {},
          message: error.message || "Failed to update product.",
          err: error.explanation || error,
        });
    }
  }

  async destroy(req, res) {
    try {
      const { id } = req.params;
      const response = await productService.destroy(id);
      return res.status(StatusCodes.OK).json({
        data: response,
        success: true,
        message: "Successfully delete the product.",
        err: {},
      });
    } catch (error) {
      return res
        .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          success: false,
          data: {},
          message: error.message || "Failed to delete product.",
          err: error.explanation || error,
        });
    }
  }

  async getAllProducts(req, res) {
    try {
      const { page = 1, limit = 10, name, category } = req.query;

      const products = await productService.getAllProducts({
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        name,
        category,
      });

      return res.status(StatusCodes.OK).json({
        data: products,
        success: true,
        message: "Successfully fetched products.",
        err: {},
      });
    } catch (error) {
      return res
        .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          success: false,
          data: {},
          message: error.message || "Failed to fetch products.",
          err: error.explanation || error,
        });
    }
  }
}

module.exports = ProductController;
