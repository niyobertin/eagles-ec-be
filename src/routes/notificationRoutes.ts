import { Router } from "express";
import { getUserNotifications, readNotification } from "../controllers/notificationController";
import { isLoggedIn } from "../middlewares/isLoggedIn";


const notificationRoutes = Router()


notificationRoutes.get("/",isLoggedIn,getUserNotifications)
notificationRoutes.get("/:id",isLoggedIn,readNotification)



export default notificationRoutes;