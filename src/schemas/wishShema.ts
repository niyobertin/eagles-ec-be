import Joi from 'joi'

export const wishSchema = Joi.object({
    productId: Joi.number().required()
})