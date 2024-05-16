import { sign, verify } from "jsonwebtoken";
import { env } from "./env";

export const generateResetToken = (email: string, expiresInMinutes: number): string => {
    // Calculate expiration date
    const createdAt = new Date();
    const expiresAt = new Date(createdAt.getTime() + expiresInMinutes * 60000); 
    const token = sign({
        email,
        createdAt,
        expiresAt
    }, 
    `${env.jwt_secret}`
); 
    return token;
};

export const verifyResetToken = (token: string): { email: string } | null => {
    try {
        // @ts-ignore
        const decodedToken = verify(token, env.jwt_secret);
        if (decodedToken.expiresAt && Date.now() >= decodedToken.expiresAt *1000) {
            return null; 
        }
        // @ts-ignore
        return decodedToken as { email: string };
    } catch (error) {
        return null;
    }
};