"use strict";

module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').Sequelize} Sequelize
   */
  async up(queryInterface, Sequelize) {
    // Update the isMerchant column to have a default value of true
    await queryInterface.changeColumn("users", "isMerchant", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true, // Set default value to true
    });
  },

  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').Sequelize} Sequelize
   */
  async down(queryInterface, Sequelize) {
    // Revert the change by resetting the default value to false
    await queryInterface.changeColumn("users", "isMerchant", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false, // Revert default value back to false
    });
  },
};
