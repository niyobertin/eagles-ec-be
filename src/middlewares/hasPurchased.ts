import { NextFunction, Request, Response } from "express";
import Order from "../sequelize/models/orders";
import OrderItem from "../sequelize/models/orderItems";

export const hasPurchasedProduct = async (req: Request, res: Response, next: NextFunction) => {
  //@ts-ignore
  const buyerId = req.user.id;
  const productId = Number(req.params.pid);
  const order = await Order.findAll({
    where: { buyerId },
    include: [
      {
        model: OrderItem,
        as: "items",
      },
    ],
  });

  let productFound = false;

  if (order) {
    for (let i = 0; i < order.length; i++) {
      for (let j = 0; j < order[i].items.length; j++) {
        if (order[i].items[j].productId === productId) {
          productFound = true;
          next();
          break;
        }
      }
      if (productFound) break;
    }
  }

  if (!productFound) {
    return res.status(403).json({
      status: 403,
      message: "Forbidden, you have not purchased this product.",
    });
  }
};