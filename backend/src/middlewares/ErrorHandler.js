const httpStatus = require("http-status");

// Optional import (won’t crash if APiError export is wrong)
let APiError;
try {
  APiError = require("../utils/APiError");
} catch (e) {
  APiError = null;
}

const ErrorHandling = (err, req, res, next) => {
  // 🔥 CRITICAL: never let error handler crash
  try {
    console.error("🔥 GLOBAL ERROR:", err);

    let statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    let message = "Internal Server Error";

    // Custom API Error (safe check)
    if (APiError && err instanceof APiError) {
      statusCode = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
      message = err.message || message;
    }
    // Mongoose Validation Error
    else if (err.name === "ValidationError") {
      statusCode = httpStatus.BAD_REQUEST;
      message = Object.values(err.errors)
        .map((e) => e.message)
        .join(", ");
    }
    // CastError (invalid ObjectId etc.)
    else if (err.name === "CastError") {
      statusCode = httpStatus.BAD_REQUEST;
      message = `Invalid ${err.path}: ${err.value}`;
    }
    // Explicit status errors
    else if (err.statusCode || err.status) {
      statusCode = err.statusCode || err.status;
      message = err.message || message;
    }
    // Generic error
    else if (err.message) {
      message = err.message;
    }

    res.status(statusCode).json({
      success: false,
      message,
      // 🔒 Do NOT expose stack in production
      ...(process.env.NODE_ENV === "development" && {
        stack: err.stack,
      }),
    });
  } catch (handlerError) {
    // 🚑 Ultimate fallback (prevents "next is not a function" loops)
    console.error("❌ ErrorHandler crashed:", handlerError);

    res.status(500).json({
      success: false,
      message: "Critical server error",
    });
  }
};

module.exports = ErrorHandling;