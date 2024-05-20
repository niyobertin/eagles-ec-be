import { Request, Response, NextFunction } from "express";
import { viewCart } from "../services/cart.service";

export const hasItemsInCart = async (req: Request, res: Response, next: NextFunction) => {
    const user: any = req.user;
    const cart = await viewCart(user);
    if (!cart.userCart.items || (cart.userCart.items.length < 1)) {
        return res.status(400).json({
            message: "No items found in your cart! add items to continue."
        });
    }
    //@ts-ignore
    req.cart = cart;
    next();

};