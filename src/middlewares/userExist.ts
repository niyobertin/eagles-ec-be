import {Request, Response, NextFunction} from 'express';
import User from '../sequelize/models/users';
import {Op} from 'sequelize';


export const userExist = async (req: Request, res: Response, next: NextFunction) => {
    const isInExistence = await User.findOne({
        where: {
         id: req.params.id 
        }
      });
    if (!isInExistence) {
        return res.status(409).json({ message: 'Provided UserId not Found' });
    }
    next();
}