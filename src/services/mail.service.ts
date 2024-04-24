import Token from "../sequelize/models/Token";
import { IUser, SUBJECTS } from "../types";
import { env } from "../utils/env";
import { generateMagicLinkToken } from "../utils/jsonwebtoken";
import transporter from "../utils/transporter";
import { verifyOtpTemplate } from "../email-templates/verifyotp";

export const sendEmailService = async (user: IUser, subject: string, template: any, token: number) => {
  try {
    const mailOptions = {
      from: env.smtp_user,
      to: user.email,
      subject: subject,
      html: template,
    };

    const info = await transporter.sendMail(mailOptions);
    //@ts-ignore
    console.log(info.response);
  } catch (error: any) {
    throw new Error(error.message);
  }
};
