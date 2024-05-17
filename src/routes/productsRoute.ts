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

const productsRouter = Router();
productsRouter.get("/search", searchProductController)

productsRouter.get("/",fetchProducts);
productsRouter.get("/:id",fetchSingleProduct);
productsRouter.post("/",isLoggedIn,isAseller,upload.array('images'),
validateSchema(productDataSchema),isCategoryExist,addProducts);
productsRouter.patch("/:id",isLoggedIn,isAseller,upload.array('images'),productsUpdate);
productsRouter.patch("/:id/status",isLoggedIn,isAseller,productAvailability);
productsRouter.delete("/:id",isLoggedIn,isAseller,removeProducts);

productsRouter.get("/:pid/reviews", getreviewController)
productsRouter.post("/:pid/reviews",isLoggedIn,  validateSchema(addReviewValidate), hasPurchasedProduct, addReviewController)
productsRouter.delete("/:pid/reviews", isLoggedIn, deleteReviewController)
productsRouter.patch("/:pid/reviews",  isLoggedIn, validateSchema(updateReviewValidate), updateReviewController)
export default productsRouter;