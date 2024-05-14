/* eslint-disable @typescript-eslint/no-unused-vars */
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: Sequelize.STRING,
        allowNull: true,
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

    const isRoleIdColumnExists = await queryInterface.describeTable("users").then((columns) => {
      return "roleId" in columns;
    });

    if (!isRoleIdColumnExists) {
      await queryInterface.addColumn("users", "roleId", {
        type: Sequelize.INTEGER,
        defaultValue: 1,
        references: {
          model: "Roles",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("profiles", "userId");
    await queryInterface.dropTable("users");
  },
};
