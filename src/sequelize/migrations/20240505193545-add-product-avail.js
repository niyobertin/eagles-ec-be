"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const isAvailableColumnExists = await queryInterface.describeTable("products").then((columns) => {
      return "isAvailable" in columns;
    });

    if (!isAvailableColumnExists) {
      await queryInterface.addColumn("products", "isAvailable", {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("products", "isAvailable");
  },
};
