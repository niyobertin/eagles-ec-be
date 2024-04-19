/* eslint-disable @typescript-eslint/no-unused-vars */
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert("Users", [
			{
				name: "Rukundo Soleil",
				username: "soleil00",
				email: "soleil@soleil00.com",
				password: "soleil00",
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				name: "test user",
				username: "yes",
				email: "soleil@soleil0w.com",
				password: "soleil0w0",
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		]);
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete("Users", null, {});
	},
};
