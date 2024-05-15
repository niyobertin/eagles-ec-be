import { Request,Response } from "express";
import { uploadImage } from "../utils/uploadImages";
import { CategoryType } from "../types";
import {
     getAllCategories,
     createCategories,
     getSingleCategory,
     updateCategories,
     deleteCategories
     } from "../services/categories.services";

 export const fetchCategories =  async(req:Request,res:Response) =>{
        try {
            const categories = await getAllCategories();
            if(categories.length <=0){
                res.status(200)
                .json({
                    status:200,
                    message:"categories list is empty"
                });
            }else{
                res.status(200).json({
                    message: "categories fetched successfully",
                    count: categories.length,
                    categories: categories,
                  });
            }
        } catch (error:any) {
            res.status(500).json({
                message: "Internal server error",
                error: error.message,
            });
    };
 };

 export const fetchSingleCategory = async(req:Request,res:Response) => {
    try {
        const id = req.params.id;
        const category =  await getSingleCategory(id);
        if(category === null){
            res.status(404)
            .json({
                status:404,
                message:"category not found"
            });
        }else{
            res.status(200)
            .json({
                status:200,
                category:category
            });
         }
    } catch (error:any) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
          });  
    };
};

 export const addCategories = async(req:Request,res:Response) =>{
    try {
        const imageUrl:any = process.env.NODE_ENV === "test"? "file1":
        await uploadImage(req.file);
        const {name,description}:CategoryType = req.body;
        const category = {
            name,
            description,
            image:imageUrl,
            createdAt: new Date(),
            updatedAt: new Date() 
        };
        const isCreated = await createCategories(category);
        if(isCreated){
            res.status(201).json(
                {
                    status:201, 
                    message:"New category added"
                });
        }else{
            res.status(409).json(
                {
                    status:409,
                    message:`This category, ${category.name} already exist.`,
                });
        }
    } catch (error:any) {
        res.status(500).json({
            status:500,
            error: error.message,
          }); 
    };
};

export const categoriesUpdate  = async(req:Request,res:Response) =>{
    try {
        const isUpdated = await updateCategories(req);
        if(isUpdated){
            res.status(201).json(
                {
                    status:201,
                    message:"Category updated"
                });
        }else{
            res.status(404)
            .json({
                status:404,
                message:"Category not found"
            });
        }
    } catch (error:any) {
        res.status(500).json({
            status:500,
            error: error.message,
          }); 
    }
}

export const removeCategories = async(req:Request,res:Response) =>{
    try {
        const isDeleted = await deleteCategories(req);
        if(isDeleted){
            res.status(200).json(
                {
                    status:200,
                    message:"Category removed"
                });
        }else{
            res.status(404)
            .json({
                status:404,
                message:"Category not found"
            });
        }
    } catch (error:any) {
        res.status(500).json({
            status:500,
            error: error.message,
          }); 
    }
}