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
const categoriesRouter = Router();
categoriesRouter.get("/",isLoggedIn,isAseller,fetchCategories);
categoriesRouter.get("/:id",isLoggedIn,isAseller,fetchSingleCategory);
categoriesRouter.post("/",isLoggedIn,isAseller,upload.single('image'),validateSchema(categoriesDataSchema)
,addCategories);
categoriesRouter.patch("/:id",isAseller,upload.single('image'),categoriesUpdate);
categoriesRouter.delete("/:id",isLoggedIn,isAseller,removeCategories);

export default categoriesRouter;