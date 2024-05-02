import { Request, Response, NextFunction } from 'express';
import { Role } from '../sequelize/models/roles';
import { Op } from 'sequelize';

export const roleExist = async (req: Request, res: Response, next: NextFunction) => {
    const isInExistence = await Role.findOne({ where: {
            id: req.body.roleId
        }
    }
    );
        
    if (!isInExistence) {
        return res.status(404).json({ message: 'Provided RoleID is not found' });
    }
    next();
};