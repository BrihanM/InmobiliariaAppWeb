import { prisma } from "../prismaClient";
import { IUserRepository, UserFilters } from "../../../domain/repositories/user.repository";
import { User } from "../../../domain/entities/user.entity";

export class PrismaUserRepository implements IUserRepository {
  async create(user: Partial<User>): Promise<User> {
    const u = await prisma.user.create({ data: { ...user } as any });
    return new User(u.id, u.email, u.password, u.firstName, u.lastName, u.createdAt, u.updatedAt, u.deletedAt);
  }

  async findById(id: string): Promise<User | null> {
    const u = await prisma.user.findUnique({ where: { id }, include: { roles: { include: { role: true } } } });
    if (!u || u.deletedAt) return null;
    return new User(u.id, u.email, u.password, u.firstName, u.lastName, u.createdAt, u.updatedAt, u.deletedAt);
  }

  async findMany(filters: UserFilters, page: number, pageSize: number) {
    const where: any = { deletedAt: null };
    if (filters.email) where.email = { contains: filters.email, mode: 'insensitive' };
    if (filters.firstName) where.firstName = { contains: filters.firstName, mode: 'insensitive' };
    if (filters.lastName) where.lastName = { contains: filters.lastName, mode: 'insensitive' };
    if (filters.role) {
      where.roles = { some: { role: { name: filters.role } } };
    }
    const total = await prisma.user.count({ where });
    const users = await prisma.user.findMany({ where, skip: (page - 1) * pageSize, take: pageSize, orderBy: { createdAt: 'desc' } });
    const data = users.map(u => new User(u.id, u.email, u.password, u.firstName, u.lastName, u.createdAt, u.updatedAt, u.deletedAt));
    return { data, total };
  }

  async update(id: string, payload: Partial<User>): Promise<User> {
    const u = await prisma.user.update({ where: { id }, data: payload as any });
    return new User(u.id, u.email, u.password, u.firstName, u.lastName, u.createdAt, u.updatedAt, u.deletedAt);
  }

  async softDelete(id: string): Promise<void> {
    await prisma.user.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  async patchRoles(userId: string, roleIds: string[]): Promise<void> {
    // remove existing
    await prisma.userRole.deleteMany({ where: { userId } });
    const toCreate = roleIds.map(rid => ({ userId, roleId: rid }));
    if (toCreate.length > 0) await prisma.userRole.createMany({ data: toCreate });
  }
}
