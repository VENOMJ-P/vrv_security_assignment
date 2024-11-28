const AppError = require("./error-handler");
const { StatusCodes } = require("http-status-codes");

class ValidationError extends AppError {
  constructor(error) {
    const errorName = error.name;
    let explanation = [];
    error.errors.forEach((err) => {
      explanation.push(err.message);
    });

    super(
      errorName,
      "Request data validation failed",
      explanation,
      StatusCodes.BAD_REQUEST
    );
  }
}

module.exports = ValidationError;
