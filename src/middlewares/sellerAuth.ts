import {  Request,Response, NextFunction} from "express";
import { isLoggedIn } from "./isLoggedIn";
import { Role } from "../sequelize/models/roles";
import { decodeToken } from "../utils/jsonwebtoken";
import { getUserByEmail } from "../services/user.service";
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

export const authenticateAndAppendUserRole = async (req: Request, res: Response, next: NextFunction) => {
  let token: string | undefined = undefined;
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      //@ts-ignore
      req.userRole = "Other";
      //@ts-ignore
      req.userId = null; 
      return next();
    }

    const decoded: any = await decodeToken(token);
    const loggedUser: any = await getUserByEmail(decoded.email);
  
    if (!loggedUser || !loggedUser.role) {
      //@ts-ignore
      req.userRole = "Other";
      //@ts-ignore
      req.userId = null;
    } else {
      //@ts-ignore
      req.userRole = loggedUser.role;
      //@ts-ignore
      req.userId = loggedUser.id;
    }
    next();
  } catch (error: any) {
    return res.status(401).json({
      status: "failed",
      error: error.message + " Token has expired. Please login again.",
    });
  }
};