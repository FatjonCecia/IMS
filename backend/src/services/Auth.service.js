// src/services/Auth.service.js
const httpStatus = require("http-status");
const { UserModel, ProfileModel } = require("../models");
const APiError = require("../utils/APiError");
const { generatoken } = require("../utils/Token.utils");

class AuthService {
  static async RegisterUser(body) {
    const { email, password, name /*, token */ } = body;

    // ======= Bypass captcha for local testing =======
    const data = { success: true };
    if (!data.success) {
      throw new APiError(httpStatus.BAD_REQUEST, "Captcha Not Valid");
    }

    // Check if user already exists
    const checkExist = await UserModel.findOne({ email });
    if (checkExist) {
      throw new APiError(httpStatus.BAD_REQUEST, "User Already Registered");
    }

    // Create user
    const user = await UserModel.create({ email, password, name });

    // Generate tokens
    const tokend = generatoken(user);
    const refresh_token = generatoken(user, "2d");

    // Create profile
    await ProfileModel.create({
      user: user._id,
      refresh_token,
    });

    // Return data to controller (do NOT use 'response' here!)
    return {
      msg: "User Registered Successfully",
      token: tokend,
    };
  }
}

module.exports = AuthService;