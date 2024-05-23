import express from 'express';
import { roleController } from '../controllers/roleControllers';
import { isLoggedIn } from '../middlewares/isLoggedIn';
import{isAdmin} from '../middlewares/isAdmin';
import { validateSchema } from '../middlewares/validator';
import {roleSchema} from '../schemas/roleSchema';
import { isPasswordOutOfDate } from '../middlewares/isPasswordOutOfDate';

const RoleRouter = express.Router();

RoleRouter.post('/', isLoggedIn,isPasswordOutOfDate, isAdmin, validateSchema(roleSchema), roleController.createRole);
RoleRouter.get('/',roleController.getRoles);
RoleRouter.patch('/:id', isLoggedIn,isPasswordOutOfDate, isAdmin, validateSchema(roleSchema),roleController.updateRole);
RoleRouter.delete('/:id', isLoggedIn,isPasswordOutOfDate, isAdmin, roleController.deleteRole);

export default RoleRouter;