import Joi from "joi";

export const passwordUpdateSchema = Joi.object({
    oldPassword: Joi.string()
        .min(6).max(20).required(),
    newPassword: Joi.string()
        .min(6).max(20).required(),
    confirmPassword: Joi.string()
        .min(6).max(20).required()
}).options({ allowUnknown: false })