const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { UserRepository } = require("../repositories/index.js");
const { JWT_SECRET } = require("../config/serverConfig.js");

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

      // Save user to the database
      const createdUser = await this.userRepository.createUser(userToCreate);

      // Remove sensitive information before returning
      const userResponse = { ...createdUser };
      delete userResponse.password;

      return userResponse;
    } catch (error) {
      console.log("Something went wrong in user services", error);
      throw error;
    }
  }

  async signin(login, password, ip) {
    try {
      // Fetch user
      const user = await this.userRepository.findByUsernameOrEmail(login);
      if (!user) {
        throw new Error("Invalid credentials");
      }

      // Check if user is active
      if (!user.isActive) {
        throw new Error("User account is not active");
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error("Invalid credentials");
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
      console.log("Something went wrong in user service", error);
      throw error;
    }
  }

  async getUserProfile(userId) {
    try {
      return await this.userRepository.findUserWithRole(userId);
    } catch (error) {
      console.log("Something went wrong in user service", error);
      throw error;
    }
  }

  // Update user profile
  async updateUserProfile(userId, data, roleId) {
    try {
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
      console.log("Something went wrong in user service", error);
      throw error;
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
      if (!currentPassword || !newPassword || !confirmNewPassword) {
        return {
          success: false,
          message: "All password fields are required",
        };
      }

      if (newPassword !== confirmNewPassword) {
        return {
          success: false,
          message: "New passwords do not match",
        };
      }

      const passwordStrengthRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordStrengthRegex.test(newPassword)) {
        return {
          success: false,
          message: "New password must meet complexity requirements",
        };
      }

      const user = await this.userRepository.findUserById(userId);
      if (!user) {
        return {
          success: false,
          message: "User not found",
        };
      }

      const isCurrentPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password
      );

      if (!isCurrentPasswordValid) {
        return {
          success: false,
          message: "Current password is incorrect",
        };
      }
      await this.userRepository.updateUser(userId, newPassword);

      return { success: true };
    } catch (error) {
      console.log("Something went wrong in user service", error);
      throw error;
    }
  }

  async adminUpdateUser(userId, updateData) {
    try {
      return this.userRepository.updateUser(userId, updateData);
    } catch (error) {
      console.log("Something went wrong in user service", error);
      throw error;
    }
  }

  async deleteUserProfile(userId) {
    try {
      const response = await this.userRepository.deleteUser(userId);
      return {
        success: true,
        message: "User profile deleted successfully",
        data: response,
      };
    } catch (error) {
      console.log("Error deleting user profile:", error);
      throw error;
    }
  }
}

module.exports = UserService;
