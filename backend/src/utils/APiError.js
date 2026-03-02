class APiError extends Error {
  constructor(statusCode = 500, message = "Internal Server Error") {
    super(message);

    this.name = "APiError";
    this.statusCode = statusCode;
    this.message = message;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = APiError;