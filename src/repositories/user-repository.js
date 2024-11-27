const { Op } = require("sequelize");
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

  async findByUsernameOrEmail(login) {
    return await User.findOne({
      where: {
        [Op.or]: [{ username: login }, { email: login }],
      },
    });
  }

  async updateLastLogin(userId, timestamp) {
    const user = await User.findByPk(userId);
    if (user) {
      await user.update({ lastLogin: timestamp });
    }
    return user;
  }
}

module.exports = UserRepository;
