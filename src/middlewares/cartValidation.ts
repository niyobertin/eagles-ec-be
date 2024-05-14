
import { NextFunction, Request, Response } from "express";
import Joi from "joi";

const cartSchema = Joi.object({
  productId: Joi.number().required().error(new Error("productId is required")),
  quantity: Joi.number().optional().error(new Error("quantity is required")),
});

const updateProductQtySchema = Joi.object({
  productId: Joi.number().required().error(new Error("productId is required")),
  quantity: Joi.number().required().error(new Error("quantity is required")),
});
const removeProductSchema = Joi.object({
  productId: Joi.number().required().error(new Error("productId is required")),
});

export async function validateCart(req: Request, res: Response, next: NextFunction) {
  try {
    await cartSchema.validateAsync(req.body, { abortEarly: false });
    return next();
  } catch (error: any) {
    return res.status(400).json({
      message: `${error.message}`
    });
  }
}
export async function validateUpdateProductQty(req: Request, res: Response, next: NextFunction) {
  try {
    await updateProductQtySchema.validateAsync(req.body, { abortEarly: false });
    return next();
  } catch (error: any) {
    return res.status(400).json({
      message: error.message
    });
  }
}
export async function validateRemoveProductQty(req: Request, res: Response, next: NextFunction) {
  try {
    await removeProductSchema.validateAsync(req.body, { abortEarly: false });
    return next();
  } catch (error: any) {
    return res.status(400).json({
      message: error.message
    });
  }
}