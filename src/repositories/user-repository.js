const { User } = require("../models");

class UserRepository {
  async createUser(userData) {
    try {
      return await User.create(userData);
    } catch (error) {
      console.log("Something went wrong in user-repository");
      throw error;
    }
  }
}

module.exports = UserRepository;
