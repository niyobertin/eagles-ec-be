import { Request, Response, NextFunction } from "express";
import validator from "email-validator";
import { Schema } from "joi";

export const emailValidation = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const { email } = req.body;

	if (!email) {
		return res.status(400).json({
			status: 400,
			message: "Email is required",
		});
	}

	const isValid = validator.validate(email);
	if (isValid) {
		next();
	} else {
		return res.status(400).json({
			status: 400,
			message: "Email is not valid.",
		});
	}
};

export const validateSchema = (schema: Schema) => {
	return (req: Request, res: Response, next: NextFunction) => {
		const { error } = schema.validate(req.body);
		if (error) {
			return res.status(400).json({ message: error.details[0].message });
		}
		next();
	};
};
