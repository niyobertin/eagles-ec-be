import { IUser } from "../types";
import { env } from "../utils/env";
import { sign, verify } from "jsonwebtoken";

export const generateToken = async (user: IUser) => {
  const accessToken = sign(
    {
      email: user.email,
      password: user.password,
    },
    `${env.jwt_secret}`,
    { expiresIn: "72h" },
  );
  return accessToken;
};

export const decodeToken = async (token: string) => {
  const decoded = await verify(token, `${env.jwt_secret}`);
  return decoded;
};

export const generateMagicLinkToken = async (user: IUser) => {
  const token = sign({ email: user.email }, `${env.jwt_secret}`, {
    expiresIn: "5m",
  });
  return token;
};

export const verifyMagicLinkToken = async (token: string) => {
  try {
    const decoded = verify(token, `${env.jwt_secret}`);
    return decoded;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
