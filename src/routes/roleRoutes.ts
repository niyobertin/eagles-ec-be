import express from 'express';
import { roleController } from '../controllers/roleControllers';
import { isLoggedIn } from '../middlewares/isLoggedIn';
import{isAdmin} from '../middlewares/isAdmin';
import { validateSchema } from '../middlewares/validator';
import {roleSchema} from '../schemas/roleSchema';

const RoleRouter = express.Router();

RoleRouter.post('/', isLoggedIn, isAdmin, validateSchema(roleSchema), roleController.createRole);
RoleRouter.get('/', roleController.getRoles);
RoleRouter.patch('/:id', isLoggedIn, isAdmin, validateSchema(roleSchema),roleController.updateRole);
RoleRouter.delete('/:id', isLoggedIn, isAdmin, roleController.deleteRole);

export default RoleRouter;