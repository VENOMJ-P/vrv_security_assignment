const express = require("express");
const UserController = require("../../controllers/user-controller");
const { validateSignup, validateSignin } = require("../../middlewares/index");

const router = express.Router();
const userController = new UserController();

router.get("/health", (req, res) => {
  res.status(200).json({
    message: "Ok",
  });
});

router.post("/user/signup", validateSignup, userController.signup);

module.exports = router;
