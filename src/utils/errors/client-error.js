const AppError = require("./error-handler");

class ClientError extends AppError {
  constructor(name, message, explanation, statusCode) {
    super(name, message, explanation, statusCode);
    this.statusCode = statusCode || 400;
  }
}

module.exports = ClientError;
