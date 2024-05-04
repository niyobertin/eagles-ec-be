import Wishes from "../sequelize/models/wishes";
import { Op } from "sequelize";
import Product from "../sequelize/models/products";
import User from "../sequelize/models/users";

export const getAllUserWishes = async (userId: number) => {
    const wishes = await Wishes.findAll({ where: { userId }, include: {model: Product, as: 'product'}});
    return wishes;
}

export const getSingleWish = async (userId: number, productId: number) => {
    const wish = await Wishes.findOne({ where: {[Op.and]: [{ userId }, { productId }]} })
    return wish;
}

export const getProduct = async (productId: number) => {
    const product = await Product.findByPk(productId);
    return product;
}

export const addToWishlist = async (userId: number, productId:number) => {
    const addedProduct = await Wishes.create({
        userId, productId
    });
    return addedProduct;
}

export const getProductWishes = async (productId: number) => {
    const productWishes = await Wishes.findAll({ where: { productId }, 
        include: {model: User, as: 'user', attributes: ['id', 'name', 'username', 'email'],
        }});
    return productWishes;
}

export const checkOwnership = async (productId: number, sellerId: number) => {
    const product = await Product.findByPk(productId);
    if(product?.userId === sellerId){
        return true;
    } else {
        return false
    }
}

export const removeProduct = async (userId: number, productId: number) => {
    const removeProduct = await Wishes.destroy({ where: {[Op.and]: [{ userId }, { productId }]} })
    return removeProduct
}

