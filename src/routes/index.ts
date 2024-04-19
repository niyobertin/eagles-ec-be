import { Request, Response, Router } from "express";
import userRoutes from "./userRoutes";


const appROutes = Router();

appROutes.use("/users", userRoutes);


export default appROutes;
