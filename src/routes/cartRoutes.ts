import { Router } from "express";
import { addItemToCart, clearAllProductFromCart, viewUserCart, removeProductFromCart, updateProductQuantity } from "../controllers/cartControllers";
import { isLoggedIn } from "../middlewares/isLoggedIn";
import { isQuantityValid } from "../middlewares/isQuantityValid";
import { isProductFound } from "../middlewares/isProductFound";
import { validateCart, validateRemoveProductQty, validateUpdateProductQty } from "../middlewares/cartValidation";
import { isPasswordOutOfDate } from "../middlewares/isPasswordOutOfDate";

const cartRoutes = Router();

cartRoutes.get("/",isLoggedIn,isPasswordOutOfDate,viewUserCart);
cartRoutes.post("/",isLoggedIn,isPasswordOutOfDate,validateCart, isQuantityValid, addItemToCart);
cartRoutes.put("/",isLoggedIn,isPasswordOutOfDate,validateRemoveProductQty, isProductFound,removeProductFromCart);
cartRoutes.delete("/",isLoggedIn,isPasswordOutOfDate, clearAllProductFromCart);
cartRoutes.patch("/",isLoggedIn,isPasswordOutOfDate,validateUpdateProductQty, isProductFound, updateProductQuantity);

export default cartRoutes;
