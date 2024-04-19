import bcrypt from "bcrypt";
export const comparePasswords = async (
	plainPassword: string,
	hashedPassword: string,
): Promise<boolean> => {
	return await bcrypt.compare(plainPassword, hashedPassword);
};
