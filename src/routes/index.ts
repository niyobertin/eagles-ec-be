import { Router } from "express";
import userRoutes from "./userRoutes";
import productsRouter from "./productsRoute";
import categoriesRouter from "./categoriesRoutes";
import wishesRouter from "./wishesRoutes";
import { joinChatRoomRoutes } from "./chatRoutes";
import cartRoutes from "./cartRoutes";
import notificationRoutes from "./notificationRoutes";
const appROutes = Router();

appROutes.use("/users", userRoutes);
appROutes.use("/products", productsRouter);
appROutes.use("/categories", categoriesRouter);
appROutes.use("/", wishesRouter);
appROutes.use("/messages", joinChatRoomRoutes);
appROutes.use("/carts", cartRoutes);
appROutes.use("/notifications", notificationRoutes);
export default appROutes;
