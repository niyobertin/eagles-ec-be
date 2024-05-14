import { NextFunction, Request, Response } from "express";
import Product from "../sequelize/models/products";
import { UserAttributes } from "../sequelize/models/users";
import Cart, { CartAttributes } from "../sequelize/models/Cart";
import CartItem, { CartItemAttributes } from "../sequelize/models/CartItem";
import { Model } from "sequelize";

export const isProductFound = async(req: Request, res: Response, next: NextFunction) => {
    
    const { productId } = req.body;
    //@ts-ignore
    const currentUser:UserAttributes = req.user
    try {
      const product = await Product.findByPk(productId);
      const userCart = await Cart.findOne({
        where: { userId: currentUser.id },
        include: [{ model: CartItem, as: "items", include: [{ model: Product, as: "product" }] }],
      });

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      const isProductInUserCart = userCart!.items.some((item: CartItemAttributes) => item.product?.id === productId);

      if (!isProductInUserCart) {
        return res.status(404).json({ message: "Product doesn't exists in your cart" });
      }
      //@ts-ignore
      req.userCart = userCart;
      next();
    } catch (error: any) {
        
        res.status(500).json({message: error.message})
        
    }
}