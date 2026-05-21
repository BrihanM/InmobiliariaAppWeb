import { randomUUID } from "crypto";
import { prisma } from "../prismaClient";
import { IUserRepository, UserFilters } from "../../../domain/repositories/user.repository";
import { User } from "../../../domain/entities/user.entity";

const WITH_ROLES = { roles: { include: { role: true } } } as const;

function toUser(u: any): User & { role?: string } {
  const entity = new User(u.id, u.email, u.password, u.firstName, u.lastName, u.createdAt, u.updatedAt, u.deletedAt);
  if (u.roles) (entity as any).role = u.roles[0]?.role?.name ?? null;
  return entity as User & { role?: string };
}

export class PrismaUserRepository implements IUserRepository {
  async create(user: Partial<User>): Promise<User> {
    const u = await prisma.user.create({ data: { ...user } as any, include: WITH_ROLES });
    return toUser(u);
  }

  async findById(id: string): Promise<User | null> {
    const u = await prisma.user.findUnique({ where: { id }, include: WITH_ROLES });
    if (!u || u.deletedAt) return null;
    return toUser(u);
  }

  async findMany(filters: UserFilters, page: number, pageSize: number) {
    const where: any = { deletedAt: null };
    if (filters.email) where.email = { contains: filters.email, mode: "insensitive" };
    if (filters.firstName) where.firstName = { contains: filters.firstName, mode: "insensitive" };
    if (filters.lastName) where.lastName = { contains: filters.lastName, mode: "insensitive" };
    if (filters.role) where.roles = { some: { role: { name: filters.role } } };

    const total = await prisma.user.count({ where });
    const users = await prisma.user.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
      include: WITH_ROLES,
    });
    const data = users.map(toUser);
    return { data, total };
  }

  async update(id: string, payload: Partial<User>): Promise<User> {
    const u = await prisma.user.update({ where: { id }, data: payload as any, include: WITH_ROLES });
    return toUser(u);
  }

  async softDelete(id: string): Promise<void> {
    await prisma.user.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  async patchRoles(userId: string, roleNames: string[]): Promise<void> {
    const roles = await prisma.role.findMany({ where: { name: { in: roleNames } } });
    await prisma.userRole.deleteMany({ where: { userId } });
    if (roles.length > 0) {
      await prisma.userRole.createMany({
        data: roles.map((r) => ({ id: randomUUID(), userId, roleId: r.id })),
      });
    }
  }
}
