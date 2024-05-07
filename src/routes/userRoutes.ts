import { Router } from "express";
import { fetchAllUsers, createUserController, userLogin, updatePassword, tokenVerification, handleSuccess, handleFailure,updateProfileController, getProfileController, otpVerification, changeUserAccountStatus } from "../controllers/userControllers";
import { emailValidation, validateSchema } from "../middlewares/validator";
import { isLoggedIn } from "../middlewares/isLoggedIn";
import { passwordUpdateSchema } from "../schemas/passwordUpdate";
import { authenticateUser, callbackFn } from "../services/user.service";
require("../auth/auth");
import logInSchema from "../schemas/loginSchema";
import { profileSchemas, signUpSchema } from "../schemas/signUpSchema";
import upload from "../middlewares/multer";
import isUploadedFileImage from "../middlewares/isImage";
import bodyParser from "body-parser";
import { isAdmin } from "../middlewares/isAdmin";
import { roleUpdateSchema } from "../schemas/userRoleUpdateSchema";
import { updateUserRole } from "../controllers/userControllers";
import { roleExist } from "../middlewares/roleExist";
import { userExist } from "../middlewares/userExist";
import { isDisabled } from "../middlewares/isDisabled";
 


const userRoutes = Router();

userRoutes.get("/", fetchAllUsers);
userRoutes.put("/passwordupdate", isLoggedIn, validateSchema(passwordUpdateSchema), updatePassword)
userRoutes.post("/login", emailValidation,validateSchema(logInSchema),isDisabled,userLogin);
userRoutes.post("/register", emailValidation, validateSchema(signUpSchema), createUserController);
userRoutes.put("/passwordupdate", isLoggedIn, validateSchema(passwordUpdateSchema), updatePassword);
userRoutes.get("/2fa-verify/:token",tokenVerification);
userRoutes.post("/2fa-verify",otpVerification);
userRoutes.get('/profile',
 isLoggedIn, 
 getProfileController
)
userRoutes.patch('/profile',
 isLoggedIn, 
 upload.single('profileImage'),
 validateSchema(profileSchemas),
 isUploadedFileImage,
 updateProfileController
)

userRoutes.patch("/:id/role",isLoggedIn, isAdmin, validateSchema(roleUpdateSchema), userExist, roleExist, updateUserRole)
userRoutes.patch('/:userId/status',isLoggedIn, isAdmin, changeUserAccountStatus);

userRoutes.get("/auth/google", authenticateUser);
userRoutes.get("/auth/google/callback", callbackFn);
userRoutes.get("/auth/google/success", handleSuccess);
userRoutes.get("/auth/google/failure", handleFailure);

export default userRoutes;
