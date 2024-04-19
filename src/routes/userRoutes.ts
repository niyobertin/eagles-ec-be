import { Router } from "express";
import { fetchAllUsers,userLogin } from "../controllers/userControllers";

const userRoutes = Router();

userRoutes.get("/", fetchAllUsers);
userRoutes.post('/login',userLogin);

export default userRoutes;
