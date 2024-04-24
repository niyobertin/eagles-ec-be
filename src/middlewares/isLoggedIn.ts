import { getUserByEmail } from "../services/user.service";
import { Request, Response, NextFunction } from "express";
import { decodeToken } from "../utils/jsonwebtoken"

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