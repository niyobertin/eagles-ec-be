import { Router } from "express";
import { fetchAllUsers, createUserController, userLogin, updatePassword, tokenVerification, handleSuccess, handleFailure } from "../controllers/userControllers";
import { emailValidation, validateSchema } from "../middleware/validator";
import signUpSchema from "../schemas/signUpSchema";
import { isLoggedIn } from "../middlewares/isLoggedIn";
import { passwordUpdateSchema } from "../schemas/passwordUpdate";
import { isTokenFound } from "../middlewares/isTokenFound";
import { authenticateUser, callbackFn } from "../services/user.service";
require("../auth/auth");
import logInSchema from "../schemas/loginSchema";

const userRoutes = Router();

userRoutes.get("/", fetchAllUsers);
userRoutes.put("/passwordupdate", isLoggedIn, validateSchema(passwordUpdateSchema), updatePassword)
userRoutes.post("/login", emailValidation,validateSchema(logInSchema),userLogin);
userRoutes.post("/register", emailValidation, validateSchema(signUpSchema), createUserController);
userRoutes.put("/passwordupdate", isLoggedIn, validateSchema(passwordUpdateSchema), updatePassword);
userRoutes.post("/2fa-verify", isTokenFound, tokenVerification);

userRoutes.get("/auth/google", authenticateUser);
userRoutes.get("/auth/google/callback", callbackFn);
userRoutes.get("/auth/google/success", handleSuccess);
userRoutes.get("/auth/google/failure", handleFailure);


export default userRoutes;
