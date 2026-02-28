const CatchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => {
    console.error("Caught async error:", err.message);
    console.error(err.stack);

    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(statusCode).json({ message });
  });
};

module.exports = CatchAsync;