"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("users", "role", {
      type: Sequelize.ARRAY(Sequelize.STRING),
      defaultValue: ["buyer"],
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("users", "role");
  },
};
