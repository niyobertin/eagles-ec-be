import Joi from "joi";

export const logInSchema = Joi.object({
  email: Joi.string().min(6).required().email(),
  password: Joi.string().min(6).max(20).required(),
}).options({ allowUnknown: false });

export default logInSchema;
