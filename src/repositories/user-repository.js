const { Op } = require("sequelize");
const { User, Role } = require("../models");

class UserRepository {
  async createUser(userData) {
    try {
      return await User.create(userData);
    } catch (error) {
      console.log("Something went wrong in user-repository", error);
      throw error;
    }
  }

  async findByUsernameOrEmail(login) {
    try {
      return await User.findOne({
        where: {
          [Op.or]: [{ username: login }, { email: login }],
        },
      });
    } catch (error) {
      console.log("Something went wrong in user-repository", error);
      throw error;
    }
  }

  async updateLastLogin(userId, timestamp) {
    try {
      const user = await User.findByPk(userId);
      if (user) {
        await user.update({ lastLogin: timestamp });
      }
      return user;
    } catch (error) {
      console.log("Something went wrong in user-repository", error);
      throw error;
    }
  }

  async findUserWithRole(userId) {
    try {
      console.log(userId);
      return await User.findByPk(userId, {
        attributes: { exclude: ["password", "deletedAt"] },
        include: [
          {
            model: Role,
            attributes: ["id", "name"],
          },
        ],
      });
    } catch (error) {
      console.log("Something went wrong in user-repository", error);
      throw error;
    }
  }

  // Find user by ID
  async findUserById(userId) {
    try {
      return await User.findByPk(userId);
    } catch (error) {
      console.log("Something went wrong in user-repository", error);
      throw error;
    }
  }

  // Update user
  async updateUser(userId, updateData) {
    try {
      const user = await User.findByPk(userId);
      if (!user) throw new Error("User not found");
      return await user.update(updateData);
    } catch (error) {
      console.log("Something went wrong in user-repository", error);
      throw error;
    }
  }

  // Update user
  async deleteUser(userId) {
    try {
      const user = await User.findByPk(userId);
      if (!user) throw new Error("User not found");
      // Soft delete the user
      await user.destroy();
      return user.id;
    } catch (error) {
      console.log("Something went wrong in user-repository", error);
      throw error;
    }
  }
}

module.exports = UserRepository;
