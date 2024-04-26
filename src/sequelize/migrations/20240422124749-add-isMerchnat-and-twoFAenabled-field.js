"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("users", "isMerchant", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false, // Default value for isMerchant field
    });

    await queryInterface.addColumn("users", "twoFAEnabled", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false, // Default value for twoFAEnabled field
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("users", "isMerchant");
    await queryInterface.removeColumn("users", "twoFAEnabled");
  },
};
