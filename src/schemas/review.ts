import Joi from "joi";

export const addReviewValidate = Joi.object ({
 rating: Joi.number()
 .integer()
 .min(1)
 .max(5)
 .required(),
 feedback: Joi.string()
 .max(500)
 .required()   

})
export const updateReviewValidate = Joi.object ({
 id: Joi.number()
 .integer()
 .required(),
 rating: Joi.number()
 .integer()
 .min(1)
 .max(5)
 .required(),
 feedback: Joi.string()
 .max(500)
 .required()   
}).options({allowUnknown: false})