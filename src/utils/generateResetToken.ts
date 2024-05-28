import { sign, verify } from "jsonwebtoken";
import { env } from "./env";

export const generateResetToken = (email: string, expiresInMinutes: number): string => {
    const createdAt = Math.floor(Date.now() / 1000); 
    const expiresAt = createdAt + expiresInMinutes * 60; 
    const token = sign({
        email,
        createdAt,
        expiresAt
    }, `${env.jwt_secret}`);
    return token;
};
export const generateVerificationToken = (email: string, expiresInMinutes: number): string => {
    const createdAt = Math.floor(Date.now() / 1000); 
    const expiresAt = createdAt + expiresInMinutes * 60; 
    const token = sign({
        email,
        createdAt,
        expiresAt
    }, `${env.jwt_secret}`);
    return token;
};

export const verifyResetToken = (token: string): { email: string } | null => {
    try {
        const decodedToken: any = verify(token,`${env.jwt_secret}`);
        if (decodedToken.expiresAt && Date.now() >= decodedToken.expiresAt * 1000) {
            return null;
        }
        return { email: decodedToken.email };
    } catch (error) {
        return null;
    }
};
