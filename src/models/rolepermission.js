"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class RolePermission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      RolePermission.belongsTo(models.Role);
      RolePermission.belongsTo(models.Permission);
    }
  }
  RolePermission.init(
    {
      roleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Roles",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      permissionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Permissions",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
    },
    {
      sequelize,
      modelName: "RolePermission",
      timestamps: true,
    }
  );
  return RolePermission;
};
