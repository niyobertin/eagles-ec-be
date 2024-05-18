import { getUserByEmail } from "../services/user.service";
import { Request, Response, NextFunction } from "express";
import { decodeToken } from "../utils/jsonwebtoken";
import redisClient from "../config/redis";

export const verifyToken = async (req: Request, res: Response) => {
  let token: string | undefined = undefined;
  try {
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return res.status(401).json({
        status: "Unauthorized",
        message: "You are not logged in. Please login to continue.",
      });
    }
    if (typeof token !== "string") {
      throw new Error("Token is not a string.");
    }

    const result = await redisClient.lrange("token", 0, 99999999);
    if (result.indexOf(token) > -1) {
      return res.status(401).json({
        message: "You've been logged out, Login again",
      });
    }

    const decoded: any = await decodeToken(token);
    const user: any = await getUserByEmail(decoded.email);
    if (!user) {
      return res.status(401).json({
        status: "Unauthorized",
        message: "Token has expired. Please login again.",
      });
    }
    return res.status(200).json({
      message: "You're Logged In Successfully",
      username: user.username,
      user,
    });
  } catch (error: any) {
    return res.status(401).json({
      status: "failed",
      error: error.message + " Token has expired. Please login again.",
    });
  }
};
