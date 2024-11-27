const { UserService } = require("../services/index.js");

const userService = new UserService();
class UserController {
  constructor() {}
  async signup(req, res) {
    try {
      const userData = req.body;
      const newUser = await userService.signup(userData);

      res.status(201).json({
        success: true,
        message: "User created successfully",
        data: newUser,
        err: {},
      });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({
        success: false,
        message: "Error creating user",
        data: {},
        error: error.message,
      });
    }
  }

  async signin(req, res) {
    try {
      const { login, password } = req.body;
      const { token, user } = await userService.signin(login, password);

      res.status(200).json({
        success: true,
        message: "Signin successful",
        token,
        user,
      });
    } catch (error) {
      console.error("Signin error:", error);
      res.status(401).json({
        success: false,
        message: error.message,
      });
    }
  }

  async logout(req, res) {
    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  }
}

module.exports = UserController;
