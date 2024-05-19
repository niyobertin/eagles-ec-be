import { IUser } from "../types";
import { env } from "../utils/env";
import transporter from "../utils/transporter";

export const sendEmailService = async (user: IUser, subject: string, template: any, token?: number) => {
  try {
    const mailOptions = {
      from: env.smtp_user,
      to: user.email,
      subject: subject,
      html: template,
    };


    const info = await transporter.sendMail(mailOptions);
    //@ts-ignore
  } catch (error: any) {
    throw new Error(error.message);
  }
};
export const sendNotification = async (email: string | undefined, subject: string, template: any) => {
  try {
    const mailOptions = {
      from: env.smtp_user,
      to: email,
      subject: subject,
      html: template,
    };

    const info = await transporter.sendMail(mailOptions);
    //@ts-ignore
  } catch (error: any) {
    throw new Error(error.message);
  }
};
