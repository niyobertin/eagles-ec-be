import bcrypt from 'bcryptjs';

export const hashedPassword = async (password: string) => {
    const salt = await bcrypt.genSalt(10);
    const hashpass = await bcrypt.hash(password, salt);
    return hashpass;
}
