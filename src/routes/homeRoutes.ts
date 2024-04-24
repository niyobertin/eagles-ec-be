import { Request, Response, Router } from "express";
import Token from "../sequelize/models/Token";

const homeRoute = Router();

homeRoute.get("/", (req: Request, res: Response) => {
  try {
    res.status(200).json({
      message: "Api is working 😎",
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});

export default homeRoute;
