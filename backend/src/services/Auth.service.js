// src/services/Auth.service.js
const httpStatus = require("http-status");
const { UserModel, ProfileModel } = require("../models");
const APiError = require("../utils/APiError");
const { generatoken } = require("../utils/Token.utils");
const bcrypt = require("bcryptjs");

class AuthService {

  // ===== Register User =====
  static async RegisterUser(body) {
    const { email, password, name } = body;

    // Check if user already exists
    const checkExist = await UserModel.findOne({ email });
    if (checkExist) {
      throw new APiError(httpStatus.BAD_REQUEST, "User Already Registered");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await UserModel.create({
      email,
      password: hashedPassword,
      name,
    });

    // Generate tokens
    const token = generatoken(user);
    const refresh_token = generatoken(user, "2d");

    // Create profile
    await ProfileModel.create({
      user: user._id,
      refresh_token,
    });

    return {
      msg: "User Registered Successfully",
      token,
    };
  }

  // ===== Login User =====
  static async LoginUser(body) {
    const { email, password } = body;
    console.log("Login attempt for:", email);

    const user = await UserModel.findOne({ email });
    if (!user) {
      console.log("User not found for email:", email);
      throw new APiError(httpStatus.BAD_REQUEST, "Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log("Invalid password for email:", email);
      throw new APiError(httpStatus.BAD_REQUEST, "Invalid email or password");
    }

    const token = generatoken(user);
    console.log("Login success for:", email);

    return { token };
  }

  // ===== Profile Service =====
  static async ProfileService(userId) {
    const user = await UserModel.findById(userId).select("-password");
    if (!user) {
      throw new APiError(httpStatus.NOT_FOUND, "User not found");
    }
    return user;
  }
}

module.exports = AuthService;