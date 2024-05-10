import { getUserByEmail } from "../services/user.service";
import { Request, Response, NextFunction } from "express";
import { decodeToken } from "../utils/jsonwebtoken"
import redisClient from "../config/redis";

export const isLoggedIn = async (req: Request, res: Response, next: NextFunction) => {
    let token: string | undefined = undefined;
    try{
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer ")
        ) {
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

        const result = await redisClient.lrange('token', 0, 99999999)
        if (result.indexOf(token) > -1) {
            return res.status(401).json({
                message: "You've been logged out, Login again"
            })
        }

        const decoded: any = await decodeToken(token)
        const loggedUser: any = await getUserByEmail(decoded.email);
        if (!loggedUser) {
            return res.status(401).json({
                status: "Unauthorized",
                message: "Token has expired. Please login again.",
            });
        }
        // @ts-ignore
        req.user = loggedUser;
        next();
    } catch (error: any) {
        return res.status(401).json({
            status: "failed",
            error: error.message + " Token has expired. Please login again.",
        });
    }
} 