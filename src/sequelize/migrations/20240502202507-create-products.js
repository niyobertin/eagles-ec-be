/* eslint-disable @typescript-eslint/no-unused-vars */
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('products', {
      id:{
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
    },
    name:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    images:{
        type:Sequelize.ARRAY(Sequelize.STRING(10485760)),
        allowNull: false,
    },
    stockQuantity:{
      allowNull: false,
      type: Sequelize.INTEGER, 
    },
    price:{
        allowNull: false,
        type: Sequelize.FLOAT,
    },
    discount:{
        allowNull: false,
        type: Sequelize.FLOAT,   
    },
    categoryID:{
        type:Sequelize.INTEGER,
        allowNull: false,  
    },
    userId:{
        type:Sequelize.INTEGER,
        allowNull: false,
    },
    expiryDate:{
      allowNull: false,
      type: Sequelize.DATE,
    },
    createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('products');
  }
};