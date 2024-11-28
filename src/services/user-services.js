const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");

const { UserRepository } = require("../repositories/index.js");
const { JWT_SECRET, SALT } = require("../config/serverConfig.js");
const { AppError, ClientError, ValidationError } = require("../utils/errors");

class UserService {
  constructor() {
    this.userRepository = new UserRepository();
  }
  async signup(userData) {
    try {
      const {
        username,
        email,
        password,
        firstName,
        lastName,
        roleId = 3,
      } = userData;

      // Prepare user data for creation
      const userToCreate = {
        username,
        email,
        password,
        firstName,
        lastName,
        roleId,
        isActive: true,
        lastLogin: null,
      };

      // Input validation
      if (!username || !email || !password) {
        throw new ClientError(
          "MissingUserData",
          "Incomplete user information",
          "Username, email, and password are required",
          StatusCodes.BAD_REQUEST
        );
      }

      // Save user to the database
      const createdUser = await this.userRepository.createUser(userToCreate);

      // Remove sensitive information before returning
      const userResponse = { ...createdUser };
      delete userResponse.password;

      return userResponse;
    } catch (error) {
      if (error instanceof ClientError || error instanceof ValidationError) {
        throw error;
      }

      console.log("Something went wrong in user services", error);
      throw new AppError(
        "SignupError",
        "Failed to create user",
        error.message || "An unexpected error occurred during signup",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async signin(login, password, ip) {
    try {
      // Input validation
      if (!login || !password) {
        throw new ClientError(
          "MissingCredentials",
          "Login credentials are required",
          "Both login (username/email) and password must be provided",
          StatusCodes.BAD_REQUEST
        );
      }
      // Fetch user
      const user = await this.userRepository.findByUsernameOrEmail(login);

      // Check if user is active
      if (!user.isActive) {
        throw new ClientError(
          "InactiveUser",
          "User account is not active",
          "This user account has been deactivated",
          StatusCodes.FORBIDDEN
        );
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new ClientError(
          "InvalidCredentials",
          "Invalid login credentials",
          "The provided username/email or password is incorrect",
          StatusCodes.UNAUTHORIZED
        );
      }

      // Generate JWT token
      const token = jwt.sign(
        {
          id: user.id,
          username: user.username,
          email: user.email,
          roleId: user.roleId,
          ip,
        },
        JWT_SECRET,
        { expiresIn: "24h" }
      );

      // Update last login timestamp
      await this.userRepository.updateLastLogin(user.id, new Date());

      // Return user data and token
      return {
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          roleId: user.roleId,
          userIp: ip,
        },
      };
    } catch (error) {
      if (error instanceof ClientError) {
        throw error;
      }

      console.log("Something went wrong in user service", error);
      throw new AppError(
        "SigninError",
        "Failed to signin user",
        error.message || "An unexpected error occurred during signin",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getUserProfile(userId) {
    try {
      return await this.userRepository.findUserWithRole(userId);
    } catch (error) {
      // Handle specific error types
      if (error instanceof ClientError) {
        throw error;
      }

      console.log("Something went wrong in user service", error);
      throw new AppError(
        "GetProfileError",
        "Failed to retrieve user profile",
        error.message ||
          "An unexpected error occurred while fetching user profile",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Update user profile
  async updateUserProfile(userId, data, roleId) {
    try {
      if (!userId) {
        throw new ClientError(
          "InvalidUserId",
          "User ID is required",
          "A valid user ID must be provided for profile update",
          StatusCodes.BAD_REQUEST
        );
      }
      const { username, email, firstName, lastName, isActive } = data;

      const user = await this.userRepository.findUserById(userId);
      if (!user) return null;

      const updateData = {};
      if (username) updateData.username = username;
      if (email) updateData.email = email;
      if (firstName) updateData.firstName = firstName;
      if (lastName) updateData.lastName = lastName;

      // Allow only admin roles to update isActive
      if (isActive !== undefined && (roleId === 1 || roleId === 2)) {
        updateData.isActive = isActive;
      }

      return await this.userRepository.updateUser(userId, updateData);
    } catch (error) {
      if (error instanceof ClientError || error instanceof ValidationError) {
        throw error;
      }

      console.log("Something went wrong in user service", error);
      throw new AppError(
        "UpdateProfileError",
        "Failed to update user profile",
        error.message ||
          "An unexpected error occurred while updating user profile",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Update user password
  async updatePassword(
    userId,
    currentPassword,
    newPassword,
    confirmNewPassword
  ) {
    try {
      // Input validation
      if (!userId) {
        throw new ClientError(
          "InvalidUserId",
          "User ID is required",
          "A valid user ID must be provided for password update",
          StatusCodes.BAD_REQUEST
        );
      }
      if (!currentPassword || !newPassword || !confirmNewPassword) {
        throw new ClientError(
          "IncompletePasswordData",
          "Incomplete password data",
          "All password fields are required",
          StatusCodes.BAD_REQUEST
        );
      }

      if (newPassword !== confirmNewPassword) {
        throw new ClientError(
          "PasswordMismatch",
          "New passwords do not match",
          "The new password and confirmation password must be identical",
          StatusCodes.BAD_REQUEST
        );
      }

      const passwordStrengthRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordStrengthRegex.test(newPassword)) {
        throw new ClientError(
          "WeakPassword",
          "Password does not meet complexity requirements",
          "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character",
          StatusCodes.BAD_REQUEST
        );
      }

      const user = await this.userRepository.findUserById(userId);

      const isCurrentPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password
      );

      if (!isCurrentPasswordValid) {
        throw new ClientError(
          "InvalidCurrentPassword",
          "Current password is incorrect",
          "The provided current password is not valid",
          StatusCodes.UNAUTHORIZED
        );
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, SALT);
      await this.userRepository.updateUser(userId, {
        password: hashedNewPassword,
      });

      return { success: true };
    } catch (error) {
      // Handle specific error types
      if (error instanceof ClientError || error instanceof ValidationError) {
        throw error;
      }

      console.log("Something went wrong in user service", error);
      throw new AppError(
        "UpdatePasswordError",
        "Failed to update password",
        error.message || "An unexpected error occurred while updating password",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async adminUpdateUser(userId, updateData) {
    try {
      if (!userId) {
        throw new ClientError(
          "InvalidUserId",
          "User ID is required",
          "A valid user ID must be provided for admin update",
          StatusCodes.BAD_REQUEST
        );
      }
      return this.userRepository.updateUser(userId, updateData);
    } catch (error) {
      if (error instanceof ClientError || error instanceof ValidationError) {
        throw error;
      }

      console.log("Something went wrong in user service", error);
      throw new AppError(
        "AdminUpdateUserError",
        "Failed to update user by admin",
        error.message || "An unexpected error occurred while updating user",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async deleteUserProfile(userId) {
    try {
      if (!userId) {
        throw new ClientError(
          "InvalidUserId",
          "User ID is required",
          "A valid user ID must be provided for profile deletion",
          StatusCodes.BAD_REQUEST
        );
      }

      const response = await this.userRepository.deleteUser(userId);
      return {
        success: true,
        message: "User profile deleted successfully",
        data: response,
      };
    } catch (error) {
      if (error instanceof ClientError) {
        throw error;
      }

      console.log("Error deleting user profile:", error);
      throw new AppError(
        "DeleteUserProfileError",
        "Failed to delete user profile",
        error.message ||
          "An unexpected error occurred while deleting user profile",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

module.exports = UserService;
