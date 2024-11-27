"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert(
      "Roles",
      [
        {
          id: 1,
          name: "ADMIN",
          description: "Administrator with full access",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          name: "USER",
          description: "Regular user with limited access",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 3,
          name: "MODERATOR",
          description: "Moderator with management privileges",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete("Roles", null, {});
  },
};
