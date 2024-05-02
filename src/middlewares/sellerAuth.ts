import {  Request,Response, NextFunction} from "express";
import { isLoggedIn } from "./isLoggedIn";
import { Role } from "../sequelize/models/roles";
export const isAseller  = async(req:Request,res:Response,next:NextFunction) => {
  try {
    await isLoggedIn(req,res,() => {});
    //@ts-ignore
    const roleId  = req.user.roleId;
    const role = await Role.findByPk(roleId);
    if(role?.name === 'seller'){
      next();
    }else{
      res.status(403).json({message:"Forbidden"});
    }
  } catch (error:any) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }    
}
