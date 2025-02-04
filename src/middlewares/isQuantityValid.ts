import { NextFunction, Request, Response } from "express";
import Product from "../sequelize/models/products";
import { UserAttributes } from "../sequelize/models/users";

export const isQuantityValid = async (req: Request, res: Response, next: NextFunction) => {
  //@ts-ignore
  const currentUser: UserAttributes = req.user;
  const { productId, quantity } = req.body;
  try {
    const product = await Product.findByPk(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    } else if (quantity > product!.stockQuantity) {
      return res.status(400).json({
        message: "Quantity can't exceed product stock",
      });
    } else if (quantity <= 0) {
      return res.status(400).json({
        message: "Invalid product quantity",
      });
    } else if (product.userId === currentUser.id) {
      res.status(403).json({
        message: "You can't add your own product to cart",
      });
    } else {
      //@ts-ignore
      req.product = product;
      //@ts-ignore
      req.quantity = quantity;
      next();
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
