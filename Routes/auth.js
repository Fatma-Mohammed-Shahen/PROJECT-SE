const express = require("express");
const router = express.Router();
const userController = require("../Controllers/userController");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.put("/forgetPassword", userController.forgetPassword);

module.exports = router;
