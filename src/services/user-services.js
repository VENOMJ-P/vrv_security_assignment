const { UserRepository } = require("../repositories/index.js");

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
}

module.exports = UserService;
