import { Request, Response, NextFunction } from 'express';
import {Role} from '../sequelize/models/roles';

export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore
    const roleId  = req.user.roleId;
    const role = await Role.findByPk(roleId);
    if (role?.name !== 'admin') {
      return res.status(403).json({ message: 'Only admins can perform this action' });
    }
    next();
  };