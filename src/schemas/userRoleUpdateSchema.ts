import Joi from "joi";


export const roleUpdateSchema = Joi.object({
    roleId: Joi.number().required()
    }).options({ allowUnknown: false
})