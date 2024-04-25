import dotenv from "dotenv";
dotenv.config();

export const env = {
  port: process.env.PORT || 3000,
  db_url: process.env.DB_CONNECTION as string,
  test_db_url: process.env.TEST_DB as string,
  jwt_secret: process.env.JWT_SECRET,
};
