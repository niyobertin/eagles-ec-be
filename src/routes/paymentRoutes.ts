import express from "express"
import * as paymentController from "../controllers/paymentController"
import { isLoggedIn } from "../middlewares/isLoggedIn";
import { hasItemsInCart } from "../middlewares/payments";
import { isAbuyer } from "../middlewares/isAbuyer";
import { isPasswordOutOfDate } from "../middlewares/isPasswordOutOfDate";

const paymentRouter = express.Router()

paymentRouter.post('/checkout', isLoggedIn,isPasswordOutOfDate, isAbuyer, hasItemsInCart, paymentController.createCheckoutSession);
paymentRouter.get('/success', paymentController.handleSuccess);
paymentRouter.get('/canceled', paymentController.handleFailure);

export default paymentRouter;