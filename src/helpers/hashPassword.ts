import bcrypt from 'bcryptjs'

export const hashedPassword = async(password: string) => {
    const hashpass = await bcrypt.hash(password, 10)
    return hashpass;
}