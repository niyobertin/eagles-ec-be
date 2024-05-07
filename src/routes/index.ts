import { Router } from "express";
import userRoutes from "./userRoutes";
import productsRouter from "./productsRoute";
import categoriesRouter from "./categoriesRoutes";
import wishesRouter from "./wishesRoutes";
const appROutes = Router();

appROutes.use("/users", userRoutes);
appROutes.use("/products",productsRouter);
appROutes.use('/categories',categoriesRouter);
appROutes.use("/wishes", wishesRouter);
export default appROutes;
