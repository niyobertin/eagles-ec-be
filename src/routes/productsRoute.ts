import { Router } from "express";
import { upload } from "../utils/uploadImages";
import {  fetchProducts, addProducts, fetchSingleProduct, productsUpdate, removeProducts, productAvailability,searchProductController} from "../controllers/productControllers";
import { validateSchema } from "../middlewares/validator";
import { productDataSchema } from "../schemas/productSchema";
import { isAseller } from "../middlewares/sellerAuth";
import { isLoggedIn } from "../middlewares/isLoggedIn";
import { isCategoryExist } from "../middlewares/isCategoryExist";
import { addReviewController, deleteReviewController, getreviewController, updateReviewController} from "../controllers/productControllers"
import { addReviewValidate, updateReviewValidate } from "../schemas/review";
import { hasPurchasedProduct } from "../middlewares/hasPurchased";
import { isPasswordOutOfDate } from "../middlewares/isPasswordOutOfDate";

const productsRouter = Router();
productsRouter.get("/search",isPasswordOutOfDate, searchProductController)

productsRouter.get("/",isLoggedIn,isPasswordOutOfDate,fetchProducts);
productsRouter.get("/:id",isLoggedIn,isPasswordOutOfDate,fetchSingleProduct);
productsRouter.post("/",isLoggedIn,isPasswordOutOfDate,isAseller,upload.array('images'),
validateSchema(productDataSchema),isCategoryExist,addProducts);
productsRouter.patch("/:id",isLoggedIn,isPasswordOutOfDate,isAseller,upload.array('images'),productsUpdate);
productsRouter.patch("/:id/status",isLoggedIn,isPasswordOutOfDate,isAseller,productAvailability);
productsRouter.delete("/:id",isLoggedIn,isPasswordOutOfDate,isAseller,removeProducts);

productsRouter.get("/:pid/reviews", getreviewController)
productsRouter.post("/:pid/reviews",isLoggedIn,isPasswordOutOfDate,validateSchema(addReviewValidate), hasPurchasedProduct, addReviewController)
productsRouter.delete("/:pid/reviews", isLoggedIn,isPasswordOutOfDate, deleteReviewController)
productsRouter.patch("/:pid/reviews",  isLoggedIn,isPasswordOutOfDate, validateSchema(updateReviewValidate), updateReviewController)
export default productsRouter;