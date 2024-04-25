import { Router } from "express";
import { fetchAllUsers, createUserController, userLogin } from "../controllers/userControllers";
import { emailValidation, validateSchema } from "../middleware/validator";
import signUpSchema from "../schemas/signUpSchema";

const userRoutes = Router();

userRoutes.get("/", fetchAllUsers);
userRoutes.post("/login", userLogin);
userRoutes.post("/register", emailValidation, validateSchema(signUpSchema), createUserController);

userRoutes.post("/register", createUserController);

export default userRoutes;
