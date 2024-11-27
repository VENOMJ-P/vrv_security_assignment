"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Role.hasMany(models.User, {
        foreignKey: {
          name: "roleId",
          allowNull: false,
          defaultValue: 3, // Default to 'USER' role
        },
      });

      Role.belongsToMany(models.Permission, {
        through: models.RolePermission,
        foreignKey: "roleId",
        otherKey: "permissionId",
      });
    }
  }
  Role.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.ENUM,
        values: ["ADMIN", "USER", "MODERATOR"],
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Role",
      tableName: "roles",
      timestamps: true,
      paranoid: true,
    }
  );
  return Role;
};
