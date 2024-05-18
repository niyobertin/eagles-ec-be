import Joi from "joi";

export const signUpSchema = Joi.object({
  name: Joi.string().min(5).max(40).required(),
  username: Joi.string().min(4).required(),
  email: Joi.string().min(6).required().email(),
  password: Joi.string().min(6).max(20).required(),
  role: Joi.string().optional(),
}).options({ allowUnknown: false });

export const profileSchemas = Joi.object({
    profileImage: Joi.string()
    .optional(),
    fullName: Joi.string()
    .optional(),
    gender: Joi.string()
    .valid('Male', 'Female', 'Other')
    .optional(),
    birthdate: Joi.date()
    .max("now")
    .optional(),
    preferredLanguage: Joi.string()
    .optional(),
    preferredCurrency: Joi.string()
    .optional(),
    street: Joi.string()
    .optional(),
    city: Joi.string()
    .optional(),
    state: Joi.string()
    .optional(),
    postalCode: Joi.string()
    .optional(),
    country: Joi.string()
    .optional()
})
