import Wishes from "../sequelize/models/wishes";
import { Op } from "sequelize";
import Product from "../sequelize/models/products";
import User from "../sequelize/models/users";
import { Role } from "../sequelize/models/roles";

export const getAllUserWishes = async (userId: number, roleId: number) => {
    const role = await Role.findByPk(roleId);
    if(role?.name === 'seller'){
        const wishes = await Wishes.findAll({where: { sellerId: userId }, include: [
            { 
              model: User,
              as: 'user',
              attributes: ['name', 'username', 'email']
            }
            ,{ model: Product, as: 'product'}
          ]});
        return wishes
    } else {
        const wishes = await Wishes.findAll({ where: { userId }, include: {model: Product, as: 'product'}});
        return wishes;
    }
    
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
    const product = await getProduct(productId);
    const sellerId = product?.userId
    //@ts-ignore
    const addedProduct = await Wishes.create({ userId, productId, sellerId });
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

