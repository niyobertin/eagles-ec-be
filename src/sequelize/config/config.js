const dotenv = require("dotenv");

dotenv.config();
console.log(process.env.IS_REMOTE);
module.exports = {
  development: {
    url: process.env.DB_CONNECTION,
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
  test: {
    url: process.env.TEST_DB,
    dialect: "postgres",

    dialectOptions:
      process.env.IS_REMOTE === "true"
        ? {
            ssl: {
              require: true,
              rejectUnauthorized: false,
            },
          }
        : null,
  },
  production: {
    url: process.env.DB_CONNECTION,
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};
