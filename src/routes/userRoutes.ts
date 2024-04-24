import { Router } from "express";
import { 
    fetchAllUsers, 
    createUserController,
    userLogin,
    updatePassword}
from "../controllers/userControllers";
import { 
    emailValidation,
    validateSchema,
 } from "../middleware/validator";
import signUpSchema from "../schemas/signUpSchema";
import { isLoggedIn } from "../middlewares/isLoggedIn";
import { passwordUpdateSchema } from "../schemas/passwordUpdate";

const userRoutes = Router();

userRoutes.get("/", fetchAllUsers);
userRoutes.post('/login',userLogin);
userRoutes.post("/register", 
 emailValidation, 
 validateSchema(signUpSchema), 
 createUserController
)
userRoutes.put("/passwordupdate", isLoggedIn, validateSchema(passwordUpdateSchema), updatePassword)


export default userRoutes;
