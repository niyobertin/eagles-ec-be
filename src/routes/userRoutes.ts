import { Router } from "express";
import { 
    fetchAllUsers, 
    createUserController } 
from "../controllers/userControllers";

const userRoutes = Router();

userRoutes.get("/",  fetchAllUsers);

userRoutes.post("/users/register", createUserController)


export default userRoutes;
