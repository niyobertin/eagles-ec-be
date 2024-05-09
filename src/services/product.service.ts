import { Request,Response } from "express";
import Product from "../sequelize/models/products";
import Category from "../sequelize/models/categories";
import { uploadMultipleImages } from "../utils/uploadImages";
import { isLoggedIn } from "../middlewares/isLoggedIn";
import { ProductType } from "../types";
import { Op } from "sequelize";
import { SearchQuery } from "../types";
import { Role } from "../sequelize/models/roles";
import { authStatus } from "../utils/isSellerOrNormalUser";

export const getAllProducts = async (req: Request, res: Response) => {
 try {
    await isLoggedIn(req,res,() => {});
      //@ts-ignore
      const loggedInUser:any = req.user;
      const products  = await Product.findAll({where:{userId:loggedInUser.id},
        include:{model:Category}});
    if(!products){
        return "products list is empty";
    }
    return products;
   } catch (error:any) {
        throw new Error(error.message);
   }
} 

export const getSingleProduct = async(req:Request,res:Response,id:string) =>{
    try {
        await isLoggedIn(req,res,() => {});
      //@ts-ignore
      const loggedInUser:any = req.user;
        const product = await Product.findOne({where:{id,userId:loggedInUser.id},
            include:{model:Category}});
        return product;
    } catch (error:any) {
        throw new Error(error.message); 
    }
}


export const createProducts = async(data:ProductType) =>{
    try {
       const existingProduct = await Product.findOne({where:{name:data.name}});
       const user = await Product.findOne({where:{userId:data.userId}});
        if(existingProduct && user){
           return false;
        }else{
            const products = await Product.create(data);
            return products; 
        }
    } catch (error:any) {
        console.log(error.message);
        throw new Error(error.message); 
    }
}

export const updateProducts = async(req:Request,res:Response) =>{
    const {name,stockQuantity,price,discount,categoryID,expiryDate}:any = req.body;
    try {
        let uploadedImages:any;
        let url:any[] = [];
        let newImage:any;
        uploadedImages = await uploadMultipleImages(req.files);
            for (const imageUrl of uploadedImages) {
             url.push(imageUrl);
            }

        const id = req.params.id;
        await isLoggedIn(req,res,() => {});
        //@ts-ignore
        const loggedInUser:any = req.user;
        const product:any = await Product.findOne({where:{id,userId:loggedInUser.id}});
        if(url.length === 0){
            newImage = undefined;
        }
        if(product?.images.length > 8){
            product.images.slice(-8);
        }
        newImage =(product?.images)?.concat(url);
        if(!product){
            return false;
        }else{
            const updateProduct =  await product.update({
             name:name || product.name,
             images:newImage || product.images,
             stockQuantity:stockQuantity || product.stockQuantity,
             price:price || product.price,
             discount:discount || product.discount,
             categoryID:categoryID || product.categoryID,
             expiryDate:expiryDate || product.expiryDate
             });
             return updateProduct;
        }
    } catch (error:any) {
        if (error.name === 'SequelizeValidationError') {
            throw new Error('Validation error: ' + error.message);
        } else {
            throw new Error('Update operation failed: ' + error.message);
        }
    }
}

export const deleteProduct = async(req:Request,res:Response) =>{
    try {
        const id = req.params.id;
        await isLoggedIn(req,res,() => {});
      //@ts-ignore
      const loggedInUser:any = req.user;
        const product = await Product.findOne({where:{id,userId:loggedInUser.id}});
        if(product){
            const deleted = await product.destroy();
            return deleted;
        }else{
            return false;
        }
    } catch (error:any) {
        if (error.name === 'SequelizeValidationError') {
            throw new Error('Validation error: ' + error.message);
        } else {
            throw new Error('Delete operation failed: ' + error.message);
        }
    }
}

export const searchProduct = async (search: SearchQuery, req: Request, res: Response) => {
  try {
    const { name, minPrice, maxPrice, category, expirationDate } = search;
    await authStatus(req, res);

    let query: any = {
      include: [
        {
          model: Category,
        },
      ],
    };
    if (name) {
      query.where = { ...query.where, name: { [Op.iLike]: `%${name}%` } };
    }
    if (minPrice && maxPrice) {
      query.where = {
        ...query.where,
        price: { [Op.between]: [minPrice, maxPrice] },
      };
    } else {
      if (minPrice) {
        query.where = { ...query.where, price: { [Op.gte]: minPrice } };
      }
      if (maxPrice) {
        query.where = { ...query.where, price: { [Op.lte]: maxPrice } };
      }
    }
    if (category) {
      query.include[0].where = {
        ...query.include[0].where,
        name: { [Op.iLike]: `%${category}%` },
      };
    }

    let products;
    if (req.user) {
      //@ts-ignore
      const { roleId, id } = req.user;
      const role = await Role.findByPk(roleId);

      if (role?.name === "seller") {
        query.where = { ...query.where, userId: id };
        if (expirationDate) {
          const searchedDate = new Date(expirationDate);
          query.where = {
            ...query.where,
            [Op.and]: [
              { expiryDate: { [Op.gte]: searchedDate } },
              { createdAt: { [Op.lte]: searchedDate } },
            ],
          };
        }
        
        products = await Product.findAll(query);
      } else {
        products = await Product.findAll(query);
      }
    } else {
      products = await Product.findAll(query);
    }

    if (products.length === 0) {
      const message = "No products found matching your searching";
      return { status: 404, message };
    }

    return products;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

