import { Router } from "express";
import { addItemToCart, clearAllProductFromCart, viewUserCart, removeProductFromCart, updateProductQuantity } from "../controllers/cartControllers";
import { isLoggedIn } from "../middlewares/isLoggedIn";
import { isQuantityValid } from "../middlewares/isQuantityValid";
import { isProductFound } from "../middlewares/isProductFound";
import { validateCart, validateRemoveProductQty, validateUpdateProductQty } from "../middlewares/cartValidation";

const cartRoutes = Router();

cartRoutes.get("/",isLoggedIn,viewUserCart);
cartRoutes.post("/",isLoggedIn,validateCart, isQuantityValid, addItemToCart);
// cartRoutes.post("/",isLoggedIn,validateCart, isQuantityValid, addItemToCart);
cartRoutes.put("/",isLoggedIn,validateRemoveProductQty, isProductFound,removeProductFromCart);
cartRoutes.delete("/",isLoggedIn, clearAllProductFromCart);
cartRoutes.patch("/",isLoggedIn,validateUpdateProductQty, isProductFound, updateProductQuantity);

export default cartRoutes;
