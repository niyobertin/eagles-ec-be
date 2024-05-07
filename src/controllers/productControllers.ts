import { Request,Response } from "express";
import { uploadMultipleImages } from "../utils/uploadImages";
import { 
    getAllProducts,
    createProducts,
    getSingleProduct,
    updateProducts,
    deleteProduct,
    searchProduct
} from "../services/product.service";
import { ProductType } from "../types";

export const fetchProducts =  async(req:Request,res:Response) =>{
    try {
        const products = await getAllProducts(req,res);
        if(products.length <=0){
            res.status(200)
            .json({
                status:200,
                message:"Products list is empty"
            });
        }else{
            res.status(200).json({
                message: "Products fetched successfully",
                count: products.length,
                products: products,
              });
        }
    } catch (error:any) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
          });
    };
};

export const fetchSingleProduct = async(req:Request,res:Response) => {
    try {
        const id = req.params.id;
        const product =  await getSingleProduct(req,res,id);
        if(product === null){
            res.status(404)
            .json({
                status:404,
                message:"Product not found"
            });
        }else{
            res.status(200)
            .json({
                status:200,
                product:product
            });
         }
    } catch (error:any) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
          });  
    };
};

export const addProducts = async(req:Request,res:Response) =>{
    try {
        const uploadedImages = await uploadMultipleImages(req.files);
        if (uploadedImages.length > 0 && (uploadedImages.length < 4 || uploadedImages.length > 8)) {
            return res.status(400).json({
              status: 400,
              message: "Upload at least 4 images and not longer than 8",
            });
          }else if(uploadedImages.length ===0){
            return res.status(400).json({
              status: 400,
              message: "Images is required",
            });
        }
        let ulr = [];
        for (const imageUrl of uploadedImages) {
            ulr.push(imageUrl);
          }
          //@ts-ignore
        const loggedIn:any = req.user;
        const {name,stockQuantity,price,discount,categoryID,expiryDate}:ProductType = req.body;
        const product = {
            name,
            images:ulr,
            stockQuantity,
            price,
            discount,
            categoryID,
            userId : loggedIn.id,
            expiryDate,
            createdAt: new Date(),
            updatedAt: new Date() 
        };
        const isCreated = await createProducts(product);
        if(isCreated){
            res.status(201).json(
                {
                    status:201,
                    message:"New product added in stock"
                });
        }else{
            res.status(409).json(
                {
                    status:409,
                    message:`This product, ${product.name} already exist.`,
                });
        }
    } catch (error:any) {
        res.status(500).json({
            status:500,
            error: error.message,
          }); 
    };
};

export const productsUpdate  = async(req:Request,res:Response) =>{
    try {
        const isUpdated:any = await updateProducts(req,res);
      if(isUpdated){
            res.status(201).json(
                {
                    status:201,
                    message:"Product updated"
           
                });
        }else{
            res.status(404)
            .json({
                status:404,
                message:"Product not found"
            });
        }
    } catch (error:any) {
        res.status(500).json({
            status:500,
            error: error.message,
          }); 
    }
}

export const removeProducts = async(req:Request,res:Response) =>{
    try {
        const isDeleted = await deleteProduct(req,res);
        if(isDeleted){
            res.status(200).json(
                {
                    status:200,
                    message:"Product removed"
                });
        }else{
            res.status(404)
            .json({
                status:404,
                message:"Product not found"
            });
        }
    } catch (error:any) {
        res.status(500).json({
            status:500,
            error: error.message,
          }); 
    }
}


export const searchProductController = async (req: Request, res: Response) => {
    const { name, minPrice, maxPrice, category, expirationDate } = req.query;
    
    try {
        const search = { name, minPrice, maxPrice, category, expirationDate }; 
        // @ts-ignore
        const products = await searchProduct(search, req, res); 
        res.json(products);
  
    } catch (error) {
        res.status(500).json({ error: 'Internal server Error' });
    }
};
