const dotenv = require("dotenv");

dotenv.config();
module.exports = {
  development: {
    url: process.env.DB_CONNECTION,
    dialect: "postgres",
  },
  test: {
    url: process.env.TEST_DB,
    dialect: "postgres",
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
