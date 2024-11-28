const { Op } = require("sequelize");
const { User, Role } = require("../models");
const { AppError, ClientError, ValidationError } = require("../utils/errors");
const { StatusCodes } = require("http-status-codes");

class UserRepository {
  async createUser(userData) {
    try {
      return await User.create(userData);
    } catch (error) {
      if (
        error.name === "SequelizeValidationError" ||
        error.name === "SequelizeUniqueConstraintError"
      ) {
        throw new ValidationError(error);
      }
      console.log("Something went wrong in user-repository", error);
      throw new AppError(
        "CreateUserError",
        "Failed to create user",
        error.message || "An unexpected error occurred during user creation",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findByUsernameOrEmail(login) {
    try {
      if (!login) {
        throw new ClientError(
          "InvalidLoginInput",
          "Login input is required",
          "Username or email must be provided",
          StatusCodes.BAD_REQUEST
        );
      }
      const user = await User.findOne({
        where: {
          [Op.or]: [{ username: login }, { email: login }],
        },
      });

      if (!user) {
        throw new ClientError(
          "UserNotFound",
          "User not found",
          `No user found with username or email: ${login}`,
          StatusCodes.NOT_FOUND
        );
      }

      return user;
    } catch (error) {
      if (error instanceof ClientError || error instanceof ValidationError) {
        throw error;
      }

      console.log("Something went wrong in user-repository", error);
      throw new AppError(
        "FindUserError",
        "Failed to find user",
        error.message ||
          "An unexpected error occurred while searching for user",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async updateLastLogin(userId, timestamp) {
    try {
      if (!userId) {
        throw new ClientError(
          "InvalidUserId",
          "User ID is required",
          "A valid user ID must be provided",
          StatusCodes.BAD_REQUEST
        );
      }

      const user = await User.findByPk(userId);

      if (!user) {
        throw new ClientError(
          "UserNotFound",
          "User not found",
          `No user found with ID: ${userId}`,
          StatusCodes.NOT_FOUND
        );
      }

      await user.update({ lastLogin: timestamp });
      return user;
    } catch (error) {
      // If it's already a ClientError or ValidationError, rethrow
      if (error instanceof ClientError || error instanceof ValidationError) {
        throw error;
      }

      console.log("Something went wrong in user-repository", error);
      throw new AppError(
        "UpdateLastLoginError",
        "Failed to update last login",
        error.message ||
          "An unexpected error occurred while updating last login",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findUserWithRole(userId) {
    try {
      if (!userId) {
        throw new ClientError(
          "InvalidUserId",
          "User ID is required",
          "A valid user ID must be provided",
          StatusCodes.BAD_REQUEST
        );
      }

      const user = await User.findByPk(userId, {
        attributes: { exclude: ["password", "deletedAt"] },
        include: [
          {
            model: Role,
            attributes: ["id", "name"],
          },
        ],
      });

      if (!user) {
        throw new ClientError(
          "UserNotFound",
          "User not found",
          `No user found with ID: ${userId}`,
          StatusCodes.NOT_FOUND
        );
      }

      return user;
    } catch (error) {
      // If it's already a ClientError or ValidationError, rethrow
      if (error instanceof ClientError || error instanceof ValidationError) {
        throw error;
      }

      console.log("Something went wrong in user-repository", error);
      throw new AppError(
        "FindUserWithRoleError",
        "Failed to find user with role",
        error.message ||
          "An unexpected error occurred while fetching user with role",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findUserById(userId) {
    try {
      if (!userId) {
        throw new ClientError(
          "InvalidUserId",
          "User ID is required",
          "A valid user ID must be provided",
          StatusCodes.BAD_REQUEST
        );
      }

      const user = await User.findByPk(userId);

      if (!user) {
        throw new ClientError(
          "UserNotFound",
          "User not found",
          `No user found with ID: ${userId}`,
          StatusCodes.NOT_FOUND
        );
      }

      return user;
    } catch (error) {
      // If it's already a ClientError or ValidationError, rethrow
      if (error instanceof ClientError || error instanceof ValidationError) {
        throw error;
      }

      console.log("Something went wrong in user-repository", error);
      throw new AppError(
        "FindUserByIdError",
        "Failed to find user by ID",
        error.message || "An unexpected error occurred while finding user",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async updateUser(userId, updateData) {
    try {
      if (!userId) {
        throw new ClientError(
          "InvalidUserId",
          "User ID is required",
          "A valid user ID must be provided",
          StatusCodes.BAD_REQUEST
        );
      }

      const user = await User.findByPk(userId);

      if (!user) {
        throw new ClientError(
          "UserNotFound",
          "User not found",
          `No user found with ID: ${userId}`,
          StatusCodes.NOT_FOUND
        );
      }

      return await user.update(updateData);
    } catch (error) {
      if (
        error.name === "SequelizeValidationError" ||
        error.name === "SequelizeUniqueConstraintError"
      ) {
        throw new ValidationError(error);
      }

      // If it's already a ClientError, rethrow
      if (error instanceof ClientError) {
        throw error;
      }

      console.log("Something went wrong in user-repository", error);
      throw new AppError(
        "UpdateUserError",
        "Failed to update user",
        error.message || "An unexpected error occurred while updating user",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async deleteUser(userId) {
    try {
      if (!userId) {
        throw new ClientError(
          "InvalidUserId",
          "User ID is required",
          "A valid user ID must be provided",
          StatusCodes.BAD_REQUEST
        );
      }

      const user = await User.findByPk(userId);

      if (!user) {
        throw new ClientError(
          "UserNotFound",
          "User not found",
          `No user found with ID: ${userId}`,
          StatusCodes.NOT_FOUND
        );
      }

      // Soft delete the user
      await user.update({ isActive: false });
      await user.destroy();
      return user.id;
    } catch (error) {
      // If it's already a ClientError, rethrow
      if (error instanceof ClientError) {
        throw error;
      }

      console.log("Something went wrong in user-repository", error);
      throw new AppError(
        "DeleteUserError",
        "Failed to delete user",
        error.message || "An unexpected error occurred while deleting user",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

module.exports = UserRepository;
