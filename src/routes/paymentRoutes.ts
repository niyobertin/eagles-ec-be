import express from "express"
import * as paymentController from "../controllers/paymentController"
import { isLoggedIn } from "../middlewares/isLoggedIn";
import { hasItemsInCart } from "../middlewares/payments";
import { isAbuyer } from "../middlewares/isAbuyer";

const paymentRouter = express.Router()

paymentRouter.post('/checkout', isLoggedIn, isAbuyer, hasItemsInCart, paymentController.createCheckoutSession);
paymentRouter.get('/success', paymentController.handleSuccess);
paymentRouter.get('/canceled', paymentController.handleFailure);

export default paymentRouter;