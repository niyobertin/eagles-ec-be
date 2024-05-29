'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const isVerifiedColumnExists = await queryInterface.describeTable("users").then((columns) => {
      return "isAvailable" in columns;
    });

    if (!isVerifiedColumnExists) {
      await queryInterface.addColumn("users", "isVerified", {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("users", "isVerified");
  },
};

