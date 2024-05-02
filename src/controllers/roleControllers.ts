import { Request, Response } from 'express';
import { roleService } from '../services/role.service';
import { Optional } from 'sequelize';
import { IRole } from '../sequelize/models/roles';

export const roleController = {
  createRole: async (req: Request, res: Response) => {
    const { name, permissions } = req.body;

    const existingRole = await roleService.findRoleByName(name);
    if (existingRole) {
      return res.status(400).json({ message: 'Role already exists' });
    }

    const role = await roleService.createRole({ name, permissions });
    res.status(201).json({
      message: 'Role created successfully',
      role: role
    });
  },

  getRoles: async (req: Request, res: Response) => {
   
    const roles = await roleService.getRoles();
    if (roles.length === 0) {
      return res.status(404).json({ message: 'No roles found' });
    }
    res.status(200).json({
      message: 'Roles fetched successfully',
      count: roles.length,
      roles: roles
    });
  },

  updateRole: async (req: Request, res: Response) => {
    const { id } = req.params;
    const {name} = req.body
    const existingRole = await roleService.findRoleByName(name);
    if (existingRole) {
      return res.status(400).json({ message: 'Role already exists' });
    }
    const updatedRoleData: Optional<IRole, "id"> = req.body;
    const updatedRole = await roleService.updateRole(Number(id), updatedRoleData);
    if (!updatedRole) {
      return res.status(404).json({ message: `Role with id: ${id} not found` });
    }
    res.status(200).json({
      message: 'Role updated successfully',
      updatedRole: updatedRole
    });
  },

  deleteRole: async (req: Request, res: Response) => {
    const { id } = req.params;
    const deleted = await roleService.deleteRole(Number(id));
    if (!deleted) {
      return res.status(404).json({ message: 'Role not found' });
    }
    res.status(200).json({ 
      status: 200,
      message: 'Role deleted successfully'
     });
  }
};