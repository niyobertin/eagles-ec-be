import { Router } from "express";
import userRoutes from "./userRoutes";
import productsRouter from "./productsRoute";
import categoriesRouter from "./categoriesRoutes";
const appROutes = Router();

appROutes.use("/users", userRoutes);
appROutes.use("/products",productsRouter);
appROutes.use('/categories',categoriesRouter)
export default appROutes;
