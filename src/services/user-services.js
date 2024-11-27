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
      console.log("Something went wrong in user services");
      throw error;
    }
  }

  async signin(login, password) {
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
        },
      };
    } catch (error) {
      console.log("Something went wrong in user service");
      throw error;
    }
  }
}

module.exports = UserService;
