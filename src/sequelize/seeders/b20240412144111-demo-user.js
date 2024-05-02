/* eslint-disable @typescript-eslint/no-unused-vars */
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const bcrypt = require("bcrypt");
    
  
    
    return Promise.all([queryInterface.bulkInsert("Roles",[
      {
        name: "buyer",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "seller",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]),

    queryInterface.bulkInsert("users", [
      {
        name: "Rukundo Soleil",
        username: "soleil00",
        email: "soleil@soleil00.com",
        password: await bcrypt.hash("soleil00", 10),
        roleId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "test user",
        username: "yes",
        email: "soleil@soleil0w.com",
        password: await bcrypt.hash("soleil00", 10),
        roleId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])
  ]);

  },
  down: async (queryInterface, Sequelize) => {
    
    return queryInterface.bulkDelete("users", null, {});
  },
};
