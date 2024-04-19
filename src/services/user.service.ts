import { errors } from "undici-types";
import User from "../sequelize/models/user";

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
