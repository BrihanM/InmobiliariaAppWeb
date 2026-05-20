import { Role } from "../entities/role.entity";

export interface IRoleRepository {
  findByName(name: string): Promise<Role | null>;
  findById(id: string): Promise<Role | null>;
}
