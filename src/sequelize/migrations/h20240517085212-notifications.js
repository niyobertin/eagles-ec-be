'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.createTable("notifications", {
     id: {
       allowNull: false,
       autoIncrement: true,
       primaryKey: true,
       type: Sequelize.INTEGER,
     },
     userId: {
       type: Sequelize.INTEGER,
       allowNull: false,
     },
     title: {
       type: Sequelize.STRING,
       allowNull: false,
     },
     message: {
       type: Sequelize.STRING,
       allowNull: false,
     },
     isRead: {
       type: Sequelize.BOOLEAN,
       allowNull: false,
       defaultValue: false,
     },
     createdAt: {
       allowNull: false,
       type: Sequelize.DATE,
     },
     updatedAt: {
       allowNull: false,
       type: Sequelize.DATE,
     },
   })
  },

  async down (queryInterface, Sequelize) {
  await queryInterface.dropTable("notifications")
  }
};
