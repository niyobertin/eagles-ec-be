import { IUser, SUBJECTS } from "../types";
import { generateMagicLinkToken, generateToken } from "../utils/jsonwebtoken";
import { env } from "../utils/env";
import transporter from "./transporter";
import { verifyOtpTemplate } from "./verifyotp";

export const sendOTP = async (user: IUser) => {
  try {
    const token = await generateMagicLinkToken(user);

    const url = `http://localhost:${env.port}/api/v1/users/2fa/verify?token=${token}`;

    const mailOptions = {
      from: env.smtp_user,
      to: user.email,
      subject: SUBJECTS.CONFIRM_OTP,
      html: verifyOtpTemplate(url),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(info.response);
  } catch (error: any) {
    throw new Error(error.message);
  }
};
