import { Request, Response } from "express";
import { IUser, STATUS } from "../types";
import { generateToken, verifyMagicLinkToken } from "../utils/jsonwebtoken";
import User from "../sequelize/models/users";

export const otpVerification = async (req: Request, res: Response) => {
  const token = req.query.token as string;
  try {
    const decoded = await verifyMagicLinkToken(token);
    //@ts-ignore
    const userEmail = decoded.email;
    //@ts-ignore
    const user: IUser = await User.findOne({ where: { email: userEmail } });

    if (!user) {
      return res.status(401).json({
        message: "Token expired",
      });
    }

    const accessToken = await generateToken(user);

    return res.status(200).json({
      message: "Succesfuly loged in",
      token: accessToken,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
