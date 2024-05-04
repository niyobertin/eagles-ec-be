import { Request, Response, NextFunction } from 'express';
import User from '../sequelize/models/users';

export const isDisabled = async (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore
    const { email} = req.body;
    const user = await User.findOne({
        where:{
            email:email
        }
    });
    if (user?.isActive === false) {
      return res.status(403).json({ message: 'Account disabled' });
    }
    next();
  };