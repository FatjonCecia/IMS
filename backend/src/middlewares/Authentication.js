const APiError = require("../utils/APiError");
const httpStatus = require("http-status");
const { validateToken } = require("../utils/Token.utils");

const Authentication = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // 🔒 Check header existence
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(
        new APiError(
          httpStatus.UNAUTHORIZED,
          "Please login first"
        )
      );
    }

    // 🔑 Extract token safely
    const token = authHeader.split(" ")[1];

    if (!token) {
      return next(
        new APiError(
          httpStatus.UNAUTHORIZED,
          "Token missing"
        )
      );
    }

    // 🧠 Validate JWT
    const decoded = validateToken(token);

    // 🔥 CRITICAL: handle invalid/expired tokens properly
    if (!decoded || !decoded.userid) {
      return next(
        new APiError(
          httpStatus.UNAUTHORIZED,
          "Invalid or expired token"
        )
      );
    }

    // Attach user to request
    req.user = decoded.userid;

    next();
  } catch (error) {
    console.error("AUTH ERROR:", error);

    return next(
      new APiError(
        httpStatus.UNAUTHORIZED,
        "Invalid or expired token"
      )
    );
  }
};

module.exports = Authentication;