import { Router } from "express";
import { getUserNotifications, readNotification } from "../controllers/notificationController";
import { isLoggedIn } from "../middlewares/isLoggedIn";


const notificationRoutes = Router()


notificationRoutes.get("/",isLoggedIn,getUserNotifications)
notificationRoutes.patch("/:id",isLoggedIn,readNotification)



export default notificationRoutes;