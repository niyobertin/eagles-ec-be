import { Router } from "express";
import userRoutes from "./userRoutes";
import productsRouter from "./productsRoute";
import categoriesRouter from "./categoriesRoutes";
import wishesRouter from "./wishesRoutes";
import { joinChatRoomRoutes } from "./chatRoutes";
const appROutes = Router();

appROutes.use("/users", userRoutes);
appROutes.use("/products",productsRouter);
appROutes.use('/categories',categoriesRouter);
appROutes.use("/wishes", wishesRouter);
appROutes.use("/messages",joinChatRoomRoutes)
export default appROutes;
