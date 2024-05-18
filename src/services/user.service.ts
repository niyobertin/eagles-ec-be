import User from "../sequelize/models/users";
import { hashedPassword } from "../utils/hashPassword";
import passport from "passport";
import Profile, { ProfileAttributes } from "../sequelize/models/profiles";
import { Role } from "../sequelize/models/roles";
import { error } from "console";
import { sendEmailService } from "./mail.service";
import { Op, QueryTypes } from "sequelize";
import userRoutes from "../routes/userRoutes";
import sequelize from "../config/dbConnection";
import { activationTemplate } from "../email-templates/activation";
import redisClient from "../config/redis";
import { generateResetToken, verifyResetToken } from "../utils/generateResetToken";
import { env } from "../utils/env";
import { generatePasswordResetEmail } from "../email-templates/generatePasswordResetEmail";
import { generatePasswordUpdateEmailContent } from "../email-templates/generatePasswordUpdateEmailContent";



export const authenticateUser = passport.authenticate("google", {
  scope: ["email", "profile"],
});

export const callbackFn = passport.authenticate("google", {
  successRedirect: "/api/v1/users/auth/google/success",
  failureRedirect: "/api/v1/users/auth/google/failure",
});

export const getAllUsers = async () => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'username', 'email', 'roleId', 'createdAt', 'updatedAt','isActive'],
    });
    if (users.length === 0) {
      console.log("no user");
    }
    return users;
  } catch (error: any) {
    console.log(error.message);
    throw new Error(error.message);
  }
};

export const loggedInUser = async (email: string) => {
  try {
    const user: any = await User.findOne({
      where: { email: email },
      include: [{model: Role, as: "userRole"}]
    });
    return user;
  } catch (err: any) {
    throw new Error(err.message);
  }
};
export const createUserService = async (name: string, email: string, username: string, password: string): Promise<User | null> => {
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    return null;
  }
  const hashPassword = await hashedPassword(password);
  let user;

 
    user = await User.create(
      //@ts-ignore
      {
      name,
      email,
      username,
      password: hashPassword,
    });
    await Profile.create({ 
      // @ts-ignore
      userId: user.id,
      profileImage:"",
      fullName: "", 
      email: "",
      gender: "", 
      birthdate: "", 
      preferredLanguage: "", 
      preferredCurrency: "", 
      street: "",
      city: "",
      state: "",
      postalCode:"",
      country: "",
     });
    return user;
  }
 


export const getUserByEmail = async (email: string): Promise<User | null> => {
  const user = await User.findOne({
    where: { email },
  });
  return user;
};

export const findUserById = async (id: string) => {
  try {
    const user = await User.findByPk(id);
    if (user) {
      return user;
    } else {
      return null;
    }
  } catch (error: any) {
    console.log("error seaching user : " + error.message);
    throw new Error(error.message);
  }
};
export const updateUserPassword = async (user: User, password: string) => {
  const update = await User.update({ password: password}, { where: { id: user.id}})
  return update
};

export const getProfileServices = async (userId: number) =>{
   try {
    const getProfile = await Profile.findOne({where: {userId}})
    return getProfile;
   } catch (error) {
    throw new Error ("error during retrieve profile")
   }
}

export const updateProfileServices = async (
    userId: number, 
    profileData: Partial<
    import("../sequelize/models/profiles")
    .ProfileAttributes >) => {
    try {
        const profile = await Profile.findOne({where: {userId}});
        
        if (!profile) {
            throw new Error("No Profile found");
        }
       
        await profile.update(profileData)
    } catch (error) {
       throw new Error("Error in update profile");
    }
};

export const updateUserRoleService = async (userId: number, newRoleId: number): Promise<User | null> => {
  try{
    // check if the role exists
    const role = await Role.findOne({where: {id: newRoleId}})
    if (!role){
      throw new Error(`Role with id: ${newRoleId} not found`);
}
    // update the role of the user 
    const [numberOfAffectedRows, updatedUser] = await User.update(
      {roleId: newRoleId}, 
      {where:{
      id: userId }
    ,returning: true,
      });
      
    if (numberOfAffectedRows === 0){
      throw new Error(`User with id: ${userId} not found`)
    }
    

    return updatedUser[0];
  }
  catch(error: any){
    throw new Error(`Error in service`);
  }
 
};
export const updateUserAccountStatus = async (userId:any) => {
  try {
    const existingInfo = await User.findByPk(userId)
    if(!existingInfo){
      return { status: 404, data: { message: 'User not found' } };
    }
    const updatedUser = await User.update({
      isActive: !existingInfo.isActive
    },
    {
      where:{
      id:userId
    }})
    if(!updatedUser){
      return {
        status: 500,
        message:"Internal server error"
      }
      
    }
    //@ts-ignore
    const action = existingInfo.isActive ? 'disabled' : 'activated';
    const subject = `Account Status ${action.charAt(0).toUpperCase() + action.slice(1)}`;
    const msg = `Your account has been ${action}.`;
    //@ts-ignore
    await sendEmailService(existingInfo, subject,activationTemplate(msg, action));
    return {
      status: 200,
        message: 'User account status updated successfully',
    };
  } catch (error:any) {
   throw new Error("Account status failed to update");
  }
};

export const addToBlacklist = async (token: string) => {
  const blacklist = await redisClient.lpush('token', token);
  return blacklist;
}
export const isTokenBlacklisted = async (token: string): Promise<boolean> => {
  const isInBlacklist = await redisClient.lrange('token', 0, -1); 
  return isInBlacklist.includes(token);
};


export const  sendResetLinkEmail = async (email: any) =>{
  try {
    // @ts-ignore
    const user:any = await User.findOne({ where: { email} });
    if (!user) {
        return { status: 404, message: 'User not found.' };
    }
    const token = generateResetToken(email, 60);
    const resetLink = `${process.env.REMOTE_URL || `${process.env.LOCAL_URL}:${process.env.PORT}`}/reset-password?token=${token}`;
    const subject = "Forgot Password";
    await sendEmailService(user, subject, generatePasswordResetEmail(resetLink));

    return { 
      status: 200, 
      message: 'Password reset link sent to your email.',
};
} catch (error) {
    return { status: 500, message: 'Internal server error.' };
}
}
export const resetPassword = async (token: string, newPassword: string): Promise<{ status: number; message: string }> => {
  try {
    const decodedToken = verifyResetToken(token);
    const isBlacklisted = await isTokenBlacklisted(token);
    if (!decodedToken || isBlacklisted) {
      return { status: 400, message: 'Invalid token.' };
    }
    const user = await User.findOne({ where: { email: decodedToken.email } });
    if (!user) {
      return { status: 404, message: 'User not found.' };
    }
    const hashPassword = await hashedPassword(newPassword);
    await user.update({ password: hashPassword });
    const subject = 'Password Updated Confirmation';
    await sendEmailService(user, subject, generatePasswordUpdateEmailContent(user.name));
    await addToBlacklist(token);

    return { status: 200, message: 'Password updated successfully.' };
  } catch (error) {
    return { status: 500, message: 'Internal server error.' };
  }
};

