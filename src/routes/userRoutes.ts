import { Router } from "express";
import { 
    fetchAllUsers, 
    createUserController,
    userLogin  } 
from "../controllers/userControllers";

const userRoutes = Router();

userRoutes.get("/", fetchAllUsers);
userRoutes.post('/login',userLogin);
userRoutes.post("/register", createUserController)


export default userRoutes;
