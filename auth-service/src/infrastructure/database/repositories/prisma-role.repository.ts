import { IRoleRepository } from "../../../domain/repositories/role.repository";
import { prisma } from "../prismaClient";
import { Role } from "../../../domain/entities/role.entity";

export class PrismaRoleRepository implements IRoleRepository {
  async findByName(name: string): Promise<Role | null> {
    const found = await prisma.roles.findUnique({ where: { name } });
    if (!found) return null;
    return new Role(found.id, found.name, found.description);
  }

  async findById(id: string): Promise<Role | null> {
    const found = await prisma.roles.findUnique({ where: { id } });
    if (!found) return null;
    return new Role(found.id, found.name, found.description);
  }
}
