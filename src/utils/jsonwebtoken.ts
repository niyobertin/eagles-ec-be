import { IUser } from "../types";
import { env } from "../utils/env";
import { sign } from "jsonwebtoken";

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
