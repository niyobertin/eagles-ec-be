import nodemailer from "nodemailer";
import { env } from "../utils/env";

const transporter = nodemailer.createTransport({
  //@ts-ignore
  host: env.smtp_host,
  port: env.smtp_port,
  auth: {
    user: env.smtp_user,
    pass: env.smtp_password,
  },
});

export default transporter;
