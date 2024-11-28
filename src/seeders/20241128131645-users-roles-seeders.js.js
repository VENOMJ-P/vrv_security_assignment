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
      "Users",
      [
        {
          id: 1,
          username: "venomjp",
          email: "jay@gmail.com",
          password:
            "$2b$10$exp.3rj/29/Rpgyj7o5tvu5uYXwa2n/lkOGhx9wrgFtmiX3OQZ3xS",
          firstName: "Jay",
          lastName: "Prakash",
          roleId: 1,
          isActive: true,
          lastLogin: null,
          updatedAt: new Date(),
          createdAt: new Date(),
          deletedAt: null,
        },
        {
          id: 2,
          username: "jaymoderator",
          email: "jp@gmail.com",
          password:
            "$2b$10$exp.3rj/29/Rpgyj7o5tvu5uYXwa2n/lkOGhx9wrgFtmiX3OQZ3xS",
          firstName: "Jay",
          lastName: "Prakash",
          roleId: 2,
          isActive: true,
          lastLogin: null,
          updatedAt: new Date(),
          createdAt: new Date(),
          deletedAt: null,
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

    await queryInterface.bulkDelete("Users", {
      id: { [Sequelize.Op.in]: [1, 2] },
    });
  },
};
