import { Request, Response } from "express";
import * as userService from "../services/user.service";
import { generateToken } from "../utils/jsonwebtoken";
import { comparePasswords } from "../utils/comparePassword";
import { loggedInUser} from "../services/user.service";
import { createUserService, getUserByEmail, updateUserPassword } from "../services/user.service";
import { hashedPassword } from "../utils/hashPassword";

export const fetchAllUsers = async (req: Request, res: Response) => {
  try {
    // const users = await userService.getAllUsers();

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
  const user = await loggedInUser(email);
  const accessToken = await generateToken(user);
  if (!user) {
    res.status(404).json({
      status: 404,
      message: "User Not Found ! Please Register new ancount",
    });
  } else {
    const match = await comparePasswords(password, user.password);
    if (!match) {
      res.status(401).json({
        status: 401,
        message: " User email or password is incorrect!",
      });
    } else {
      res.status(200).json({
        status: 200,
        message: "Logged in",
        token: accessToken,
      });
    }
  }
};

export const createUserController = async (req: Request, res: Response) => {
  try {
    const { name, email, username, password } = req.body;
    const user = await createUserService(name, email, username, password);

    if (!user) {
      return res.status(409).json({
        status: 409,
        message: "Username or email already exists",
      });
    }

    res.status(201).json({
      status: 201,
      message: "User successfully created.",
    });
  } catch (err: any) {
    if (err.name === "UnauthorizedError" && err.message === "User already exists") {
      return res.status(409).json({ error: "User already exists" });
    }
    res.status(500).json({ error: err });
  }
};

export const updatePassword = async (req: Request, res: Response) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  try {
    // @ts-ignore
    const user = await getUserByEmail(req.user.email);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const isPasswordValid = await comparePasswords(oldPassword, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Old password is incorrect' });
    }
  
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'New password and confirm password do not match' });
    }

    if(await comparePasswords(newPassword, user.password)){
      return res.status(400).json({ message: 'New password is similar to the old one. Please use a new password'})
    }

    const password = await hashedPassword(newPassword);
    await updateUserPassword(user, password)
    return res.status(200).json({ message: 'Password updated successfully' });

  } catch(err: any){
    return res.status(500).json({
      message: err.message
    })
  }
}
