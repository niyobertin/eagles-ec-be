import { Router } from "express";
import { getUserNotifications, readNotification } from "../controllers/notificationController";
import { isLoggedIn } from "../middlewares/isLoggedIn";
import { isPasswordOutOfDate } from "../middlewares/isPasswordOutOfDate";


const notificationRoutes = Router()


notificationRoutes.get("/",isLoggedIn,isPasswordOutOfDate,getUserNotifications)
notificationRoutes.get("/:id",isLoggedIn,isPasswordOutOfDate,readNotification)



export default notificationRoutes;