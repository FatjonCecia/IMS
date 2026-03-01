const APiError = require("../utils/APiError");
const httpStatus = require("http-status");
const { validateToken } = require("../utils/Token.utils");

const Authentication = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(
        new APiError(httpStatus.UNAUTHORIZED, "Please Login first")
      );
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return next(
        new APiError(httpStatus.UNAUTHORIZED, "Invalid token")
      );
    }

    const data = validateToken(token);
    req.user = data.userid;

    next();
  } catch (error) {
    next(
      new APiError(
        httpStatus.UNAUTHORIZED,
        "Invalid or expired token"
      )
    );
  }
};

module.exports = Authentication;