const APiError = require("../utils/APiError")
const httpStatus = require("http-status")
const { validateToken } = require("../utils/Token.utils")

const Authentication = (req, res, next) => {
  try {
    // ✅ Correct way to get the Authorization header
    const authHeader = req.headers['authorization'] || ''

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new APiError(httpStatus.UNAUTHORIZED, "Please Login first")
    }

    // Extract token from header
    const token = authHeader.split(" ")[1]

    if (!token) {
      throw new APiError(httpStatus.UNAUTHORIZED, "Please provide a valid token")
    }

    // Validate JWT token
    const data = validateToken(token)
    req.user = data.userid // attach user info to request

    next() // pass control to the next middleware/route
  } catch (error) {
    next(error)
  }
}

module.exports = Authentication