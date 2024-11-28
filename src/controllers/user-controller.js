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
      const { token, user } = await userService.signin(login, password, req.ip);

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
  // Get user profile
  async getUserProfile(req, res) {
    try {
      console.log(req.user.id);
      const user = await userService.getUserProfile(req.user.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
      res.status(200).json({
        success: true,
        data: user,
        message: "Successfully get user",
        error: {},
      });
    } catch (error) {
      console.error("Get profile error:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching user profile",
        error: error.message,
        data: {},
      });
    }
  }

  // Update user profile
  async updateUserProfile(req, res) {
    try {
      const updatedUser = await userService.updateUserProfile(
        req.user.id,
        req.body,
        req.user.roleId
      );
      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
      res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        user: updatedUser,
        error: {},
      });
    } catch (error) {
      console.error("Update profile error:", error);
      res.status(500).json({
        success: false,
        message: "Error updating user profile",
        error: error.message,
        data: {},
      });
    }
  }

  // Update user password
  async updatePassword(req, res) {
    try {
      const { currentPassword, newPassword, confirmNewPassword } = req.body;
      const result = await userService.updatePassword(
        req.user.id,
        currentPassword,
        newPassword,
        confirmNewPassword
      );

      if (!result.success) {
        return res.status(400).json(result);
      }
      res.status(200).json({
        success: true,
        message: "Password updated successfully",
      });
    } catch (error) {
      console.error("Update password error:", error);
      res.status(500).json({
        success: false,
        message: "Error updating password",
        error: error.message,
      });
    }
  }

  async adminUpdateUser(req, res) {
    try {
      const updatedUser = await userService.adminUpdateUser(
        req.params.id,
        req.body
      );
      res.status(200).json({
        success: true,
        message: "User updated successfully",
        user: updatedUser,
        error: {},
      });
    } catch (error) {
      console.error("Admin user update error:", error);
      res.status(500).json({
        success: false,
        message: "Error updating user",
        error: error.message,
        data: {},
      });
    }
  }
}

module.exports = UserController;
