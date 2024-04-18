import { Router } from "express";
import { 
    fetchAllUsers, 
    createUserController } 
from "../controllers/userControllers";

const userRoutes = Router();

userRoutes.get("/",  fetchAllUsers);
userRoutes.post("/", createUserController)


export default userRoutes;
