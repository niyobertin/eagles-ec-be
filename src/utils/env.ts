import dotenv from "dotenv";
dotenv.config();

export const env = {
  port: process.env.PORT || 3000,
  db_url: process.env.DB_CONNECTION as string,
  test_db_url: process.env.TEST_DB as string,
  jwt_secret: process.env.JWT_SECRET,
  smtp_host: process.env.SMTP_HOST as string,
  smtp_port: process.env.SMTP_PORT,
  smtp_user: process.env.SMTP_USER as string,
  smtp_password: process.env.SMTP_PASS as string,
  clientId: process.env.GOOGLE_CLIENT_ID as string,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
  callbackURL: process.env.GOOGLE_CALLBACK_URL as string,
};