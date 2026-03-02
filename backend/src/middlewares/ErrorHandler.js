const APiError = require("../utils/APiError");

const ErrorHandling = (err, req, res, next) => {
  try {
    console.error("🔥 GLOBAL ERROR:", err);

    let statusCode = 500;
    let message = "Internal Server Error";

    if (err instanceof APiError) {
      statusCode = err.statusCode || 500;
      message = err.message;
    } else if (err.name === "ValidationError") {
      statusCode = 400;
      message = Object.values(err.errors)
        .map((e) => e.message)
        .join(", ");
    } else if (err.statusCode && Number.isInteger(err.statusCode)) {
      statusCode = err.statusCode;
      message = err.message;
    } else {
      message = err.message || message;
    }

    res.status(statusCode).json({
      success: false,
      message,
    });
  } catch (handlerError) {
    console.error("❌ ErrorHandler crashed:", handlerError);

    res.status(500).json({
      success: false,
      message: "Critical server error",
    });
  }
};

module.exports = ErrorHandling;