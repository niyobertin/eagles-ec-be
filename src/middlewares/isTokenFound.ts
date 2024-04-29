import { NextFunction, Request, Response } from "express";
import Token from "../sequelize/models/Token";

export const isTokenFound = async (req: any, res: Response, next: NextFunction) => {
  const { token } = req.body;
  try {
    const foundToken = await Token.findOne({ where: { token: token } });

    if (foundToken) {
      req.token = foundToken;
      next();
    } else {
      return res.status(404).json({
        message: "Invalid token",
      });
    }
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
