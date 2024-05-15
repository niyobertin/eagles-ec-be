import Joi from "joi";

export const chatMessageSchema = Joi.object({
 sender:Joi.string()
 .min(1)
 .required(),
 userId:Joi.number()
 .required(),
 message:Joi.string()
 .min(1)
 .required(),
})