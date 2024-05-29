/* eslint-disable @typescript-eslint/no-unused-vars */
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const bcrypt = require("bcryptjs");

    return Promise.all([
      queryInterface.bulkInsert("Roles", [
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
          lastPasswordUpdateTime:new Date(),
          roleId: 3,
          isVerified:true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "test user",
          username: "yes",
          email: "soleil@soleil0w.com",
          password: await bcrypt.hash("soleil00", 10),
          lastPasswordUpdateTime:new Date(),
          roleId: 1,
          isVerified:true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Jehovanis",
          username: "jehovanis",
          email: "mugabo.kefa00@gmail.com",
          password: await bcrypt.hash("Test@123", 10),
          lastPasswordUpdateTime:new Date(),
          roleId: 2,
          isVerified:true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "jabo seller",
          username: "Jabo24",
          email: "jaboinnovates@gmail.com",
          password: await bcrypt.hash("Test@123", 10),
          lastPasswordUpdateTime:new Date(),
          roleId: 2,
          isVerified:true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]),
    ]);
  },
  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("users", null, {});
  },
};
