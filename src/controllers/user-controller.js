const { UserService } = require("../services/index.js");

const userService = new UserService();
class UserController {
  constructor() {
    
  }
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
}

module.exports = UserController;
