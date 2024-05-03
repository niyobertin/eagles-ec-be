import {Request} from "express"
import Category from "../sequelize/models/categories";
import { uploadImage } from "../utils/uploadImages";
import { CategoryType } from "../types";
import Product from "../sequelize/models/products";

export const getAllCategories = async() => {
    try {
     const categories = await Category.findAll();
     if(!categories){
         return "categories list is empty";
     }
     return categories;
    } catch (error:any) {
         throw new Error(error.message);
    }
}

export const getSingleCategory = async(id:string) =>{
    try {
        const category = await Category.findOne({where:{id},include:{model:Product}});
        return category;
    } catch (error:any) {
        throw new Error(error.message); 
    }
}

export const createCategories = async(data:CategoryType) =>{
    try {
       const existingCategory = await Category.findOne({where:{name:data.name}});
        if(existingCategory){
           return false;
        }else{
            const category = await Category.create(data);
            return category; 
        }
    } catch (error:any) {
        throw new Error(error.message); 
    }
}

export const updateCategories = async(req:Request) =>{
    
    const {name,description}:any = req.body;
    try {
        const id = req.params.id;
        let imageUrl:any;
        if(req.file === undefined){
            imageUrl = undefined;
        }else{
            imageUrl = await uploadImage(req.file);
        }
        const category = await Category.findOne({where:{id}});
        if(category){
           const updatecategory =  await category.update({
            name:name || category.name,
            image:imageUrl || category.image,
            description:description || category.description,
           });
           return updatecategory;
        }else{
            return false;
        }
    } catch (error:any) {
        if (error.name === 'SequelizeValidationError') {
            throw new Error('Validation error: ' + error.message);
        } else {
            throw new Error('Update operation failed: ' + error.message);
        }
    }
}

export const deleteCategories = async(req:Request) =>{
    try {
        const id = req.params.id;
        const category = await Category.findOne({where:{id}});
        if(category){
            const deleted = await category.destroy();
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



