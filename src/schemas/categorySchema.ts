import Joi from "joi";

export const categoriesDataSchema = Joi.object({
 name:Joi.string()
 .min(3)
 .required(),
 description:Joi.string()
 .min(3)
 .required(),
 image:Joi.string()
})