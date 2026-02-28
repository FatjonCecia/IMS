// src/controllers/Auth.controller.js
const AuthService = require("../services/Auth.service");
const CatchAsync = require("../utils/CatchAsync");

class AuthController {
  // ===== Register User =====
  static RegisterUser = CatchAsync(async (req, res) => {
    const res_obj = await AuthService.RegisterUser(req.body);
    res.status(201).json(res_obj);
  });

  // ===== Login User =====
  static LoginUser = CatchAsync(async (req, res) => {
    const res_obj = await AuthService.LoginUser(req.body);
    res.status(200).json(res_obj);
  });

  // ===== Profile =====
  static GetProfile = CatchAsync(async (req, res) => {   // <-- renamed here
    const res_obj = await AuthService.ProfileService(req.user);
    res.status(200).json(res_obj);
  });
}

module.exports = AuthController;