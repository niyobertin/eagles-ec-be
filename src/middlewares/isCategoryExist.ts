import { Request,Response,NextFunction} from "express";
import Category from "../sequelize/models/categories";
export const isCategoryExist = async(req:Request,res:Response,next:NextFunction) => {
    const {categoryID} = req.body;
    const category = await Category.findOne({where:{id:categoryID}});
    if(!category){
        res.status(409).json({
            status:409,
            message:"There is no category for this product"
        })
    }else{
        next();
    }
}
