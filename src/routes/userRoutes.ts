import { Router } from "express";
import {
  fetchAllUsers,
  createUserController,
  userLogin,
} from "../controllers/userControllers";
import { emailValidation, validateSchema } from "../middleware/validator";
import signUpSchema from "../schemas/signUpSchema";
import { otpVerification } from "../controllers/2faControllers";

const userRoutes = Router();

userRoutes.get("/", fetchAllUsers);
userRoutes.post("/login", userLogin);
userRoutes.post(
  "/register",
  emailValidation,
  validateSchema(signUpSchema),
  createUserController
);
userRoutes.get("/2fa/verify", otpVerification);

export default userRoutes;
