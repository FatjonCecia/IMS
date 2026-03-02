const User = require("../models/user.models"); // adjust path if needed
const APiError = require("../utils/APiError");
const httpStatus = require("http-status");

// 🔥 GET ALL USERS (for table)
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password").sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// 🔥 CREATE USER (Add User button)
const createUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return next(
        new APiError(httpStatus.BAD_REQUEST, "All fields are required")
      );
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return next(
        new APiError(httpStatus.BAD_REQUEST, "Email already exists")
      );
    }

    const user = await User.create({
      name,
      email,
      password, // (hash later if needed)
    });

    const safeUser = user.toObject();
    delete safeUser.password;

    res.status(201).json({
      success: true,
      data: safeUser,
    });
  } catch (error) {
    next(error);
  }
};

// 🔥 UPDATE USER
const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    ).select("-password");

    if (!user) {
      return next(
        new APiError(httpStatus.NOT_FOUND, "User not found")
      );
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// 🔥 DELETE USER (admin feature)
const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return next(
        new APiError(httpStatus.NOT_FOUND, "User not found")
      );
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
};