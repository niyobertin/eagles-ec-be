import { Request, Response } from "express";
import Product from "../sequelize/models/products";
import Category from "../sequelize/models/categories";
import { uploadMultipleImages } from "../utils/uploadImages";
import { isLoggedIn } from "../middlewares/isLoggedIn";
import { ProductType } from "../types";
import { Op } from "sequelize";
import { SearchQuery } from "../types";
import { Role } from "../sequelize/models/roles";
import { authStatus } from "../utils/isSellerOrNormalUser";
import sequelize from "../config/dbConnection";
import { loggedInUser } from "./user.service";
import User from "../sequelize/models/users";
import eventEmmiter from "../events/emmiter";
import Review from "../sequelize/models/reviews";
import { ReviewType } from "../types";


export const getAllProducts = async (req: Request, res: Response) => {
  let products: any;
  try {
    await authStatus(req, res);
    //@ts-ignore
    const role = await Role.findByPk(req.user?.roleId);
    if (req.user && role?.name === "seller") {
      products = await Product.findAll({
        where: {
          //@ts-ignore
          userId: req.user.id,
        },
        include: [{ model: Category }, { model: User }],
      });
    } else {
      // Other users only see available products for all sellers
      const currentDate = new Date();
      products = await Product.findAll({
        where: {
          isAvailable: true,
          expiryDate: {
            [Op.gt]: currentDate,
          },
        },
        include: [{ model: Category }, { model: User }],
      });
    }
    return products;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getSingleProduct = async (req: Request, res: Response, id: string) => {
  let product: any;
  try {
    await authStatus(req, res);
    //@ts-ignore
    const role = await Role.findByPk(req.user?.roleId);
    if (req.user && role?.name === "seller") {
      product = await Product.findOne({
        where: {
          id,
          //@ts-ignore
          userId: req.user.id,
        },
        include: [{ model: Category }, { model: User }],
      });
    } else {
      // Other users only see available products for all sellers
      const currentDate = new Date();
      product = await Product.findAll({
        where: {
          id,
          isAvailable: true,
          expiryDate: {
            [Op.gt]: currentDate,
          },
        },
        include: [{ model: Category }, { model: User }],
      });
    }
    return product;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const createProducts = async (data: ProductType) => {
  try {
    const existingProduct = await Product.findOne({ where: { name: data.name } });
    const user = await Product.findOne({ where: { userId: data.userId } });
    if (existingProduct && user) {
      return false;
    } else {
      const products = await Product.create(data);
      return products;
    }
  } catch (error: any) {
    console.log(error.message);
    throw new Error(error.message);
  }
};

export const updateProducts = async (req: Request, res: Response) => {
  const { name, stockQuantity, price, discount, categoryID, expiryDate }: any = req.body;
  try {
    let uploadedImages: any;
    let url: any[] = [];
    let newImage: any;
    uploadedImages = process.env.NODE_ENV === "test" ? ["file1", "file2", "file3", "file4"] : await uploadMultipleImages(req.files);
    for (const imageUrl of uploadedImages) {
      url.push(imageUrl);
    }

    const id = req.params.id;
    await isLoggedIn(req, res, () => {});
    //@ts-ignore
    const loggedInUser: any = req.user;
    const product: any = await Product.findOne({ where: { id, userId: loggedInUser.id } });
    if (url.length === 0) {
      newImage = undefined;
    }
    if (product?.images.length > 8) {
      product.images.slice(-8);
    }
    newImage = product?.images?.concat(url);
    if (!product) {
      return false;
    } else {
      const updateProduct = await product.update({
        name: name || product.name,
        images: newImage || product.images,
        stockQuantity: stockQuantity || product.stockQuantity,
        price: price || product.price,
        discount: discount || product.discount,
        categoryID: categoryID || product.categoryID,
        expiryDate: expiryDate || product.expiryDate,
      });
      return updateProduct;
    }
  } catch (error: any) {
    if (error.name === "SequelizeValidationError") {
      throw new Error("Validation error: " + error.message);
    } else {
      throw new Error("Update operation failed: " + error.message);
    }
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    await isLoggedIn(req, res, () => {});
    //@ts-ignore
    const loggedInUser: any = req.user;
    const product = await Product.findOne({ where: { id, userId: loggedInUser.id } });
    if (product) {
      const deleted = await product.destroy();
      return deleted;
    } else {
      return false;
    }
  } catch (error: any) {
    if (error.name === "SequelizeValidationError") {
      throw new Error("Validation error: " + error.message);
    } else {
      throw new Error("Delete operation failed: " + error.message);
    }
  }
};

export const searchProduct = async (search: SearchQuery, req: Request, res: Response) => {
  try {
    const { name, minPrice, maxPrice, category, expirationDate } = search;
    await authStatus(req, res);
    const currentDate = new Date();

    let query: any = {
      include: [
        {
          model: Category,
        },
        {
          model: User,
        },
      ],
      where: {
        expiryDate: {
          [Op.gt]: currentDate,
        },
      },
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
            [Op.and]: [{ expiryDate: { [Op.gte]: searchedDate } }, { createdAt: { [Op.lte]: searchedDate } }],
          };
        }

        products = await Product.findAll(query);
      } else {
        products = await Product.findAll(query);
      }
    } else {
      query.where = { ...query.where, isAvailable: true };
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
export const updateProductAvailability = async (req: Request, res: Response) => {
  const productId = req.params.id;
  await authStatus(req, res);
  if (!productId) {
    return res.status(400).json({ message: "Product ID is required" });
  }

  try {
    let product = await Product.findOne({
      where: {
        id: productId,
        //@ts-ignore
        userId: req.user.id,
      },
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    await Product.update({ isAvailable: !product.isAvailable }, { where: { id: productId } });
    return res.status(200).json({ message: "Product availability updated successfully", isAvailable: !product.isAvailable });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const disableProductVisisbility = async (id: number) => {
  await Product.update({ isAvailable: false }, { where: { id: id } });
};
export const getProductReviews= async(productId:any) => {
  try {
    const review = await Review.findAll({
      where: {productId},
      include: [
       {
        model: User,
        as: "user",
        attributes: ["id", "name"],
       }
      ]
    })
    return review
  } catch (error:any) {
    throw new Error(error.message);
  }
}

export const createReview =  async(data:ReviewType) => {
  const {userId, productId} = data
let obj:any;
 obj = data
  const existingReview = await Review.findOne({
    where: { userId, productId}
  })

  if (!existingReview) {
   const addReview = await Review.create(obj)
  return addReview;
  }
  throw new Error("Can't review a product twice.");
}

export const deleteReview = async (data: ReviewType) => {
  const { userId, reviewId } = data;
  const isReviewExist = await Review.findOne({
    where: { userId, id: reviewId}
  })
  if (!isReviewExist) {
    throw new Error("Review not found!");
  }
 const reviewFound = await isReviewExist.destroy()
 return reviewFound;
}

export const updateReview = async (data: ReviewType) => {
  const { userId, productId, reviewId, rating, feedback } = data;
  const review = await Review.findOne({ where: { userId, productId, id: reviewId } });
  if (!review) {
    throw new Error("Review not found");
  }
  review.rating = rating;
  review.feedback = feedback;
  return await review.save();
};

