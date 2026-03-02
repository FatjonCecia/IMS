const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");
const Authentication = require("../middlewares/Authentication");

// 🔐 Internal panel = protected
router.use(Authentication);

router.get("/", userController.getAllUsers);
router.post("/", userController.createUser);
router.patch("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

module.exports = router;