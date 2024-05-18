import Joi from "joi";

export const resetPasswordSchema = Joi.object({
  token: Joi.string().required().messages({
    'any.required': 'Token is required.',
    'string.base': 'Token must be a string.',
  }),
  password: Joi.string().min(8).required().messages({
    'any.required': 'Password is required.',
    'string.min': 'Password must be at least 8 characters long.',
    'string.base': 'Password must be a string.',
  }),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
    'any.required': 'Confirm password is required.',
    'any.only': 'Passwords do not match.',
    'string.empty': 'Confirm password cannot be empty.',
  }),
}).options({
  allowUnknown:false
});

export  const Emailschema = Joi.object({
  email: Joi.string().email().required()
}).options({
  allowUnknown:false
});