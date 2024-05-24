import { Request, Response } from "express";
import * as userService from "../services/user.service";
import { decodeMagicLinkToken, generateMagicLinkToken, generateToken } from "../utils/jsonwebtoken";
import * as mailService from "../services/mail.service";
import { IUser, STATUS, SUBJECTS } from "../types";
import { comparePasswords } from "../utils/comparePassword";
import { createUserService, updateUserPassword,loggedInUser } from "../services/user.service";
import { hashedPassword } from "../utils/hashPassword";
import jwt from "jsonwebtoken"
import User from "../sequelize/models/users";
import { verifyOtpTemplate } from "../email-templates/verifyotp";
import { getProfileServices, updateProfileServices } from "../services/user.service";
import uploadFile from "../utils/handleUpload";
import { updateUserRoleService } from "../services/user.service";
import { generateRandomNumber } from "../utils/generateRandomNumber";
import { env } from "../utils/env";
import { Emailschema, resetPasswordSchema } from "../schemas/resetPasswordSchema";
import { clearExpiredUserData } from "../jobs/isPasswordExpired";
import { use } from "passport";


export const fetchAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await userService.getAllUsers();

    if (users.length <= 0) {
      return res.status(404).json({
        message: "No users found",
      });
    } else {
      res.status(200).json({
        message: "Users fetched successfully",
        count: users.length,
        users: users,
      });
    }
  } catch (error: any) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const userLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user: IUser = await loggedInUser(email);
  let accessToken;
  if (!user || user === null) {
    res.status(404).json({
      status: 404,
      message: "User Not Found ! Please Register new ancount",
    });
  } else {
    accessToken = await generateToken(user);
    const match = await comparePasswords(password, user.password);
    if (!match) {
      res.status(401).json({
        status: 401,
        message: " User email or password is incorrect!",
      });
    } else {
      // @ts-ignore
      if (user.userRole.name === "seller") {  
        const otp = generateRandomNumber();
        const token = await generateMagicLinkToken(otp, user);
        const link =
          process.env.NODE_ENV !== "production"? `${env.local_url}/${token}`: `${env.remote_url}/${token}`;
        await mailService.sendEmailService(user, SUBJECTS.VERIFY_LOGIN, verifyOtpTemplate(link,otp));
        return res.status(200).json({
          status: STATUS.PENDING,
          message: "OTP verification code has been sent ,please use it to verify that it was you",
          token,
        });
      } else {
        const userInfo = {
          
          id: user.id,
          email: user.email,
          roleId: user.userRole?.id,
          roleName: user.userRole!.name

        }
        return res.status(200).json({
          status: 200,
          message: "Logged in",
          token: accessToken
        });
      }
    }
  }
};

export const createUserController = async (req: Request, res: Response) => {
  const { name, email, username, password, role } = req.body;

  try {
    let currentUpdateTime = new Date();
    const { name, email, username, password } = req.body;
    const user = await createUserService(name, email, username, password,currentUpdateTime);
    if (!user || user == null) {
      return res.status(409).json({
        status: 409,
        message: "User already exists",
      });
    }
    return res.status(201).json({
      status: 201,
      message: "User successfully created."
    });
  } catch (err: any) {
    if (err.name === "UnauthorizedError" && err.message === "User already exists") {
      return res.status(409).json({ error: "User already exists" });
    }
    return res.status(500).json({ error: err });
  }
};


export const updatePassword = async (req: Request, res: Response) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  try {
    // @ts-ignore
    const { user } = req;
    // @ts-ignore
    const isPasswordValid = await comparePasswords(oldPassword, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "New password and confirm password do not match" });
    }
    // @ts-ignore
    if (await comparePasswords(newPassword, user.password)) {
      return res.status(400).json({ message: "New password is similar to the old one. Please use a new password" });
    }

    const password = await hashedPassword(newPassword);
    const currentUpdateTime = new Date();
    // @ts-ignore
    const update = await updateUserPassword(user, password,currentUpdateTime);
    if(update){
      //@ts-ignore
      clearExpiredUserData(user.id)
      return res.status(200).json({ message: "Password updated successfully" });
    }
  } catch (err: any) {
    return res.status(500).json({
      message: err.message,
    });
  }
};


export const tokenVerification = async (req: Request, res: Response) => {
  const {token} = req.params;

  try {
    const decoded = await decodeMagicLinkToken(token);
    //@ts-ignore
    const { otp, userId } = decoded;
    if (otp) {
      const user = await User.findOne({ where: { id: userId }, attributes: { exclude: ["password"] } });
      //@ts-ignore
      const accessToken = await generateToken(user);
      return res.status(200).json({
        message: "logged in successfuly",
        token: accessToken,
      });
    } else {
      return res.status(401).json({
        message: "Token expired",
      });
    }
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
}
};
export const handleSuccess = async (req: Request, res: Response) => {
  // @ts-ignore
  const user: UserProfile = req.user;

  try {
    let token;
    let foundUser: any = await User.findOne({
      where: { email: user.emails[0].value }
    });

    if (!foundUser) {
      const newUser:IUser = await User.create({
        name: user.displayName,
        email: user.emails[0].value,
        username: user.name.familyName,
        //@ts-ignore
        password: null
      });
      token = await generateToken(newUser);
      foundUser = newUser;
    } else {
      token = await generateToken(foundUser);
    }

    return res.status(200).json({
      token: token,
      message: 'success'
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
});
}
};


export const handleFailure = async (req: Request, res: Response) => {
  try {
    res.status(401).json({
      message: "unauthorized",
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};

 

export const getProfileController = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const profile = await getProfileServices(userId);

    if (!profile) {
      res.status(404).json({ status: 404, message: "profile not found!" });
    } else {
      const { dataValues } = profile;
      const { id, userId, email, ...filteredProfile } = dataValues;
      res.status(200).json(filteredProfile);
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateProfileController = async (req: Request, res: Response) => {
  try{  
       const userId =  (req as any).user.id;
       const profileData = req.body; 
       const file = req.file
       let profileImage;

       if (file) {
          profileImage = await uploadFile(file);
      }
      
      else if (Object.keys(profileData).length === 0) {
           return res.status(400).json({
               status: 400,
               message: "Cannot update with empty profile data"
      });
       }     
       else {
        profileImage = "";
     } 
       const updatedProfile = await updateProfileServices(
        userId,  
        { ...profileData, profileImage }
       );
       res.status(200).json({
           status: 200,
           message: "You updated your profile sucessfully!",
           updatedProfile
       });
       
   }

   catch(error) {    
       res.status(500).json({ error: 'Internal server error' });
   }
}

export const updateUserRole = async (req: Request, res: Response) => {
  const { roleId } = req.body;
  const userId = parseInt(req.params.id);
  
  try {
    
    const userToUpdate = await updateUserRoleService(userId, roleId);
    
    res.status(200).json({
      message: 'User role updated successfully',
    });   
  } 
  catch (error: any) {
    res.status(500).json({ message: 'Role or User Not Found' });
  }
};


export const otpVerification = async (req: Request, res: Response) => {
  const { token } = req.query;
  const {otp} = req.body

  try {
      //@ts-ignore
      const { otp: initialOtp, userId } = await decodeMagicLinkToken(token as string)
      if (!initialOtp) {
          return res.status(403).json({
              message: "Token expired"
          });
      }

      if (otp === initialOtp) {
          const user = await User.findOne({ where: { id: userId }, attributes: { exclude: ["password"] } });
          //@ts-ignore
          const accessToken = await generateToken(user);

          return res.status(200).json({
              message: "Logged in successfully",
              token: accessToken
          });
      } else {
          return res.status(401).json({
            message: "Invalid OTP",
          });
      }
  } catch (error:any) {
      if (error instanceof jwt.TokenExpiredError) {
          return res.status(403).json({
              message: "JWT token expired"
          });
      } else {
          return res.status(500).json({
              message: error.message,
          });
      }
  }
};

export const changeUserAccountStatus = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const updateStatusResult = await userService.updateUserAccountStatus(userId);
  return res.status(updateStatusResult.status).json(updateStatusResult);
}

export const logout = async(req:Request,res:Response) =>{
  let token: string | undefined;
    try{
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer ")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }
        if (!token) {
            return res.status(401).json({
                status: "Unauthorized",
                message: "You are not logged in. Please login to continue.",
            });
        }
    const blacklist = await userService.addToBlacklist(token)
    if(blacklist){
      res.status(200).json({
        message: "You're Logged Out Successfully"
      })
    }
  } catch (error:any) {
    res.status(500).json({
      message:error.message
    })
  }
}

export const sendResetLinkEmail = async (req: Request, res: Response) => {
  try {
      const { error } = Emailschema.validate(req.body);
      if (error) {
        const cleanErrorMessage = error.details.map(detail => detail.message.replace(/['"]/g, '').trim()).join(', ')
        return res.status(400).json({ message: cleanErrorMessage });
      }
      const { email } = req.body;
      const result = await userService.sendResetLinkEmail(email);
      return res.status(200).json(result);
  } catch (error) {
      return res.status(500).json({ message: 'Internal server error.' });
  }
};

export const resetPasswordController = async (req: Request, res: Response): Promise<any> => {
  try {
    const { error } = resetPasswordSchema.validate(req.body);
    if (error) {
      const cleanErrorMessage = error.details.map(detail => detail.message.replace(/['"]/g, '').trim()).join(', ');
      return res.status(400).json({ message: cleanErrorMessage});
    }
      const { token, password} = req.body;
      const result: any = await userService.resetPassword(token, password);

      return res.status(result.status).json({ message: result.message });
  } catch (error) {
      return res.status(500).json({ message: 'Internal server error.' });
  }
};
