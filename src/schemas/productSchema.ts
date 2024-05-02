import Joi, { required } from "joi";

const imageSchema = Joi.object({
  filename: Joi.string().required(), 
  contentType: Joi.string().required(),
});
export const productDataSchema = Joi.object({
  name:Joi.string()
  .min(3)
  .max(40)
  .required(),
  images: Joi.array().min(4).max(8),
  stockQuantity:Joi.number()
  .required(),
  price:Joi.number()
  .required(),
  discount:Joi.number()
  .required(),
  categoryID:Joi.number()
  .required(),
  expiryDate:Joi.date()
  .required()
})