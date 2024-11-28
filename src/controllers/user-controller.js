const { StatusCodes } = require("http-status-codes");

const { UserService } = require("../services/index.js");

const userService = new UserService();
class UserController {
  constructor() {}
  async signup(req, res) {
    try {
      const userData = req.body;
      const newUser = await userService.signup(userData);

      res.status(StatusCodes.CREATED).json({
        success: true,
        message: "User created successfully",
        data: newUser,
        err: {},
      });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        data: {},
        message: error.message || "Failed to create User.",
        err: error.explanation || error.message || error,
      });
    }
  }

  async signin(req, res) {
    try {
      const { login, password } = req.body;
      const { token, user } = await userService.signin(login, password, req.ip);

      res.status(StatusCodes.OK).json({
        success: true,
        message: "Signin successful",
        token,
        user,
      });
    } catch (error) {
      console.error("Signin error:", error);
      res.status(error.statusCode || StatusCodes.UNAUTHORIZED).json({
        success: false,
        data: {},
        message: error.message || "Failed to signin User.",
        err: error.explanation || error.message || error,
      });
    }
  }

  async logout(req, res) {
    res.status(StatusCodes.OK).json({
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
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: "User not found",
        });
      }
      res.status(StatusCodes.OK).json({
        success: true,
        data: user,
        message: "Successfully get user",
        error: {},
      });
    } catch (error) {
      console.error("Get profile error:", error);
      res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        data: {},
        message: error.message || "Failed to fetch user profile.",
        err: error.explanation || error.message || error,
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
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: "User not found",
        });
      }
      res.status(StatusCodes.OK).json({
        success: true,
        message: "Profile updated successfully",
        user: updatedUser,
        error: {},
      });
    } catch (error) {
      console.error("Update profile error:", error);
      res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        data: {},
        message: error.message || "Failed to update user profile.",
        err: error.explanation || error.message || error,
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
        return res.status(StatusCodes.BAD_REQUEST).json(result);
      }
      res.status(StatusCodes.OK).json({
        success: true,
        message: "Password updated successfully",
      });
    } catch (error) {
      console.error("Update password error:", error);
      res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        data: {},
        message: error.message || "Failed to update user password.",
        err: error.explanation || error.message || error,
      });
    }
  }

  async adminUpdateUser(req, res) {
    try {
      const updatedUser = await userService.adminUpdateUser(
        req.params.id,
        req.body
      );
      res.status(StatusCodes.OK).json({
        success: true,
        message: "User updated successfully",
        user: updatedUser,
        error: {},
      });
    } catch (error) {
      console.error("Admin user update error:", error);
      res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        data: {},
        message: error.message || "Failed to update user.",
        err: error.explanation || error.message || error,
      });
    }
  }

  async deleteUserProfile(req, res) {
    try {
      const userId = req.params.id;

      // Only Admins can delete a user
      const response = await userService.deleteUserProfile(userId);

      res.status(StatusCodes.OK).json({
        success: response.success,
        message: response.message,
        data: response.data,
        error: {},
      });
    } catch (error) {
      console.error("Error deleting user profile:", error);
      res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        data: {},
        message: error.message || "Failed to delete user profile.",
        err: error.explanation || error.message || error,
      });
    }
  }
}

module.exports = UserController;
