import { Router } from "express";
import { upload } from "../utils/uploadImages";
import { 
    fetchCategories,
    addCategories,
    fetchSingleCategory,
    categoriesUpdate,
    removeCategories
 } from "../controllers/categoriesControllers";
 import { validateSchema } from "../middlewares/validator";
import { categoriesDataSchema } from "../schemas/categorySchema";
import { isAseller } from "../middlewares/sellerAuth";
import { isLoggedIn } from "../middlewares/isLoggedIn";
import { isPasswordOutOfDate } from "../middlewares/isPasswordOutOfDate";
const categoriesRouter = Router();
categoriesRouter.get("/",isLoggedIn,isPasswordOutOfDate,isAseller,fetchCategories);
categoriesRouter.get("/:id",isLoggedIn,isPasswordOutOfDate,isAseller,fetchSingleCategory);
categoriesRouter.post("/",isLoggedIn,isPasswordOutOfDate,isAseller,upload.single('image'),validateSchema(categoriesDataSchema)
,addCategories);
categoriesRouter.patch("/:id",isAseller,isPasswordOutOfDate,upload.single('image'),categoriesUpdate);
categoriesRouter.delete("/:id",isLoggedIn,isPasswordOutOfDate,isAseller,removeCategories);

export default categoriesRouter;