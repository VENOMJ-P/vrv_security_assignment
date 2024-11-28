const { ProductRepository } = require("../repositories/index.js");
const { AppError } = require("../utils/errors/index.js");

class ProductService {
  constructor() {
    this.productRepository = new ProductRepository();
  }

  async create(data) {
    try {
      const product = await this.productRepository.create(data);
      return product;
    } catch (error) {
      console.log("Somthing went wrong in service layer");
      throw new AppError(
        error.name || "ProductServiceError",
        "Failed to create product",
        error.explanation || error.message,
        error.statusCode
      );
    }
  }

  async get(id) {
    try {
      const product = await this.productRepository.get(id);
      return product;
    } catch (error) {
      console.log("Somthing went wrong in service layer", error);
      throw new AppError(
        error.name || "ProductServiceError",
        "Failed to fetch product",
        error.explanation || error.message,
        error.statusCode
      );
    }
  }

  async update(data, id) {
    try {
      const product = await this.productRepository.update(data, id);
      return product;
    } catch (error) {
      console.log("Somthing went wrong in service layer", error);
      throw new AppError(
        error.name || "ProductServiceError",
        "Failed to update product",
        error.explanation || error.message,
        error.statusCode
      );
    }
  }

  async destroy(id) {
    try {
      const response = await this.productRepository.destroy(id);
      return response;
    } catch (error) {
      console.log("Somthing went wrong in service layer");
      throw new AppError(
        error.name || "ProductServiceError",
        "Failed to delete product",
        error.explanation || error.message,
        error.statusCode
      );
    }
  }

  async getAllProducts({ page, limit, name, category }) {
    try {
      const products = await this.productRepository.getAll({
        page,
        limit,
        name,
        category,
      });
      return products;
    } catch (error) {
      console.log("Something went wrong in service layer");
      throw new AppError(
        error.name || "ProductServiceError",
        "Failed to fetch products",
        error.explanation || error.message,
        error.statusCode
      );
    }
  }
}

module.exports = ProductService;
