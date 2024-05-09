import { Request, Response } from "express";
import { decodeToken } from "./jsonwebtoken";
import { getUserByEmail } from "../services/user.service";

export const authStatus = async (req: Request, res: Response) => {
  let token: any;
  try {
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return;
    }
    const decoded: any = await decodeToken(token);
    const loggedUser: any = await getUserByEmail(decoded.email);
    req.user = loggedUser;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
