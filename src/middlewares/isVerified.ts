import { Request, Response, NextFunction } from 'express';
import User from '../sequelize/models/users';

export const isVerified = async (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore
    const { email} = req.body;
    const user = await User.findOne({
        where:{
            email:email
        }
    });
    if (user?.isVerified === false) {
      return res.status(403).json({ message: 'Account is not verified' });
    }
    next();
  };