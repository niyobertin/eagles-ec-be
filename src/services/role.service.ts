import { Role, IRole } from '../sequelize/models/roles';
import { Optional } from 'sequelize';
 
class RoleService {
  async createRole(role: Optional<IRole, 'id'>): Promise<IRole> {
    const newRole = await Role.create(role);
    return newRole;
  }

  async getRoles(): Promise<IRole[]> {
    const roles = await Role.findAll();
    return roles;
  }

  async findRoleByName(name: string): Promise<IRole | null> {
    const role = await Role.findOne({ where: { name } });
    return role;
  }

  async updateRole(id: number, role: Partial<IRole>): Promise<IRole | null> {
    const [numberOfAffectedRows, updatedRoles] = await Role.update(role, { where: { id }, returning: true });
    if (numberOfAffectedRows === 0) {
      return null;
    }
    return updatedRoles[0];
  }

  async deleteRole(id: number): Promise<boolean> {
    const numberOfDestroyedRows = await Role.destroy({ where: { id } });
    return numberOfDestroyedRows > 0;
  }
}

export const roleService = new RoleService();