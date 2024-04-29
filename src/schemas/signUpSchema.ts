import Joi from "joi";

export const signUpSchema = Joi.object({
  name: Joi.string().min(5).max(40).required(),
  username: Joi.string().min(4).required(),
  email: Joi.string().min(6).required().email(),
  password: Joi.string().min(6).max(20).required(),
  role: Joi.string().optional(),
}).options({ allowUnknown: false });

export default signUpSchema;
