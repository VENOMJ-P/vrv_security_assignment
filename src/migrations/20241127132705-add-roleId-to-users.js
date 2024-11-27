"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Users", "roleId", {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 3, // Default to 'USER' role
      references: {
        model: "Roles",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Users", "roleId");
  },
};
