const APiError = require("../utils/APiError");

const ErrorHandling = (err, req, res, next) => {
  // Always ensure a valid HTTP status code
  let statusCode = 500; // default
  let message = "Internal Server Error";

  if (err instanceof APiError) {
    statusCode = err.statusCode || 500;
    message = err.message || message;
  } else if (err.statusCode) {
    statusCode = err.statusCode;
    message = err.message || message;
  } else if (err.name === "ValidationError") {
    // Mongoose validation errors
    statusCode = 400;
    message = Object.values(err.errors).map(e => e.message).join(", ");
  } else {
    message = err.message || message;
  }

  console.error("Caught error:", err);

  res.status(statusCode).json({
    statusCode,
    message,
    stack: err.stack,
  });
};

module.exports = ErrorHandling;