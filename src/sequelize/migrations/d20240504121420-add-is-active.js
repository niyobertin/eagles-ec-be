"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const isActiveColumnExists = await queryInterface.describeTable("users").then((columns) => {
      return "isActive" in columns;
    });

    if (!isActiveColumnExists) {
      await queryInterface.addColumn("users", "isActive", {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("users", "isActive");
  },
};
