import { Request, Response } from "express";
import * as userService from "../services/user.service";
import { generateToken } from "../utils/jsonwebtoken";
import { comparePasswords } from "../helpers/comparePassword";
import { loggedInUser } from "../services/user.service";
import { createUserService } from "../services/user.service";

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
