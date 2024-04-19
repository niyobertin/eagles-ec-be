import { errors } from "undici-types";
import User from "../sequelize/models/users";
import { hashedPassword } from "../helpers/hashPassword";

export const getAllUsers = async () => {
  try {
    const users = await User.findAll();
    if (users.length === 0) {
      console.log("no user");
    }
    return users;
  } catch (error: any) {
    console.log(error.message);
    throw new Error(error.message);
  }
};

export const loggedInUser = async(email:string) => {
  try{
    const user:any = await User.findOne({
      where: { email: email }
    });
    if(!user){
        return false;
    }else{
        return user;
    }
}catch(err:any){
    throw new Error(err.message);
};
};
export const createUserService = async (name: string, email: string, username: string, password: string): Promise<User | null> => {
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    return null; 
  }
  const hashPassword = await hashedPassword(password);
  const user = await User.create({ name, email, username, password: hashPassword });
  return user;
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  const user = await User.findOne({ where: { email } });
  return user;
};
