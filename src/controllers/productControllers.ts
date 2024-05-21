import { Request,Response } from "express";
import { uploadMultipleImages } from "../utils/uploadImages";
import { 
    getAllProducts,
    createProducts,
    getSingleProduct,
    updateProducts,
    deleteProduct,
    searchProduct,
    updateProductAvailability
    
} from "../services/product.service";
import { ProductType } from "../types";
import { notificationEmitter } from "../utils/server";
import Notification from "../sequelize/models/Notification";
import { UserAttributes } from "../sequelize/models/users";
import * as mailService from "../services/mail.service"
import { removedProductTemplate } from "../email-templates/removed";
import { updateProductTemplate } from "../email-templates/updated";
import { createdProductTemplate } from "../email-templates/created";
import { createReview,  deleteReview,  getProductReviews, updateReview } from "../services/product.service";
import Review from "../sequelize/models/reviews";

export const fetchProducts =  async(req:Request,res:Response) =>{
    try {
        //@ts-ignore
        // console.log(req.viewer)
        const products = await getAllProducts(req,res);
       return  res.status(200).json({
                    message: "Products fetched successfully",
                    products: products,
                  });
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
        if(product === null || product.length === 0){
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

export const addProducts = async (req: Request, res: Response) => {
    const currentUser:UserAttributes = (req as any).user
    try {
        const uploadedImages = process.env.NODE_ENV === "test"? [
        "file1",
        "file2",
        "file3",
        "file4"
        ]:  await uploadMultipleImages(req.files);
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
        if (isCreated) {

            await mailService.sendNotification(currentUser.email, "Product uploaded", createdProductTemplate(currentUser.username, isCreated?.name));
            
            const notification = await Notification.create({
              title: "Product Uploaded",
              //@ts-ignore
              message: `Your Product ${isCreated.name} successfully uploaded`,
              //@ts-ignore
              userId: currentUser.id || undefined,
            });

            
            notificationEmitter.emit("created", notification);

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

export const productsUpdate = async (req: Request, res: Response) => {
    const currentUser:UserAttributes = (req as any).user
    try {
        const isUpdated:any = await updateProducts(req,res);
        if (isUpdated) {
          
            await mailService.sendNotification(currentUser.email,"Product updated",updateProductTemplate(currentUser.username,isUpdated.name))
            const notification = await Notification.create({
              title: "Product updated",
              //@ts-ignore
              message: `Your Product ${isUpdated.name} successfully updated`,
              //@ts-ignore
              userId: currentUser.id || undefined,
            });

            notificationEmitter.emit("updated", notification);
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

export const removeProducts = async (req: Request, res: Response) => {
    const currentUser:UserAttributes = (req as any).user
    try {
        const isDeleted = await deleteProduct(req,res);
        if (isDeleted) {
          //@ts-ignore
          await mailService.sendNotification(currentUser.email, "Product deleted", removedProductTemplate(currentUser.username, isDeleted?.name));

          const notification = await Notification.create({
            title: "Product Deleted",
            //@ts-ignore
            message: `Your Product ${isDeleted.name} successfully deleted`,
            //@ts-ignore
            userId: currentUser.id || undefined,
          });

          notificationEmitter.emit("deleted", notification);
          res.status(200).json({
            status: 200,
            message: "Product removed",
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
            message: error.message,
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
export const productAvailability = async (req: Request, res: Response) => {
    try {
        const availability = await updateProductAvailability(req,res);
        return availability;
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const getreviewController = async(req: Request, res: Response) => {
    try {
       const productId =   req.params.pid
       const reviewProduct = await getProductReviews(productId)
       if (reviewProduct.length === 0) {
        return res.status(200)
         .json({
            status: 200,
            message: "No review yet, Be first to review. "
         })
       }
       return res.status(200).json({
        status: 200,
        message: "review retrieve successfully",
        reviewProduct
       })
    } catch (error: any) {
       res.status(500).json(
        error.message
       ) 
    }
}

export const addReviewController = async(req: Request, res: Response) => {
   try {
      const reviewObj:any = {
         // @ts-ignore
         userId : req.user.id,
         productId : req.params.pid,
         rating : req.body.rating,
         feedback: req.body.feedback
      }   
      await createReview(reviewObj)
      return res.status(201)
      .json({
         status: 201,
         message: "you have successfully create a review!"
      })
      
   } catch (error: any) {
      if (error.message === "Can't review a product twice.") {
        return res.status(403).json({
          status: 403,
          message: "Not allowed to review a product twice."
        });
      }
      
      return res.status(500).json({
        status: 500,
        message: "Internal server error.",
        error: error.message
      });
    }
}

export const deleteReviewController = async (req: Request, res: Response) => {
   try {
      const reviewData:any ={
         //@ts-ignore
         userId: req.user.id,
         reviewId: req.body.id
      }
   
       await deleteReview(reviewData)
      return res.status(200).
      json({
        status: 200,
         message: "You successfully deleted the review."
      })

   } catch (error:any) {
      if (error.message === "Review not found!") {
         return res.status(404).
         json({
            status: 404,
            message: "Review not found, please try again."
         })
      }
      return res.status(500).
      json({
         status: 500,
         message:error.message
      })
   }
}

export const updateReviewController = async (req: Request, res: Response) => {
   try {

      const updateObj:any = {
        //@ts-ignore
      userId: req.user.id,
      productId: req.params.pid,
      reviewId: req.body.id,
      rating: req.body.rating,
      feedback: req.body.feedback
     }
      await updateReview(updateObj)
      return res.status(201).
      json({
         status: 201,
         message: "You successfully updated your review.",
      })
   } catch (error:any) {
      if (error.message === "Review not found") {
         return res.status(404).
         json({
            status: 404,
            message: "Can't update review not found"
         })
      }
      return res.status(500).
       json({
         status: 500,
         error: error.message
       })
   }
}
