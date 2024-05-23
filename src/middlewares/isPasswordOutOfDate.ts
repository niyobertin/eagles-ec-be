import { Request,Response,NextFunction } from 'express';
import { isLoggedIn } from './isLoggedIn';
import { expiredUserData } from '../jobs/isPasswordExpired';

export const isPasswordOutOfDate = async(req:Request,res:Response,next:NextFunction) =>{
    try {
        await isLoggedIn(req,res,() => {});
        //@ts-ignore
        const loggedInUserId: any = req.user.id;
        const expiredUserIds = new Set([...expiredUserData].map((user: any) => user));
        if (expiredUserIds.has(loggedInUserId)) {
            return res.status(403).json({
                message: "Your password expired, Update it to continue"
            });
        };
        next();
    } catch (error:any) {
        console.log('Error has occured',error.message);
        next(error)
    }
}



