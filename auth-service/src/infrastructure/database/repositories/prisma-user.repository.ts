import { IUserRepository } from "../../../domain/repositories/user.repository";
import { prisma } from "../prismaClient";
import { User } from "../../../domain/entities/user.entity";
import { randomUUID } from "crypto";

const INCLUDE_ROLES = { roles: { include: { role: true } } } as const;

function toUser(raw: any): User {
  const role = raw.roles?.[0]?.role?.name ?? undefined;
  return new User({
    id: raw.id,
    firstName: raw.first_name,
    lastName: raw.last_name,
    email: raw.email,
    phone: raw.phone,
    passwordHash: raw.password_hash,
    status: raw.status,
    role,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
    deletedAt: raw.deleted_at,
  });
}

export class PrismaUserRepository implements IUserRepository {
  async create(user: any): Promise<User> {
    const created = await prisma.users.create({
      data: {
        id: user.id,
        first_name: user.firstName,
        last_name: user.lastName,
        email: user.email,
        phone: user.phone ?? null,
        password_hash: user.passwordHash,
        status: user.status ?? 'active',
      },
      include: INCLUDE_ROLES,
    });
    return toUser(created);
  }

  async findByEmail(email: string): Promise<User | null> {
    const found = await prisma.users.findUnique({
      where: { email },
      include: INCLUDE_ROLES,
    });
    if (!found) return null;
    return toUser(found);
  }

  async findById(id: string): Promise<User | null> {
    const found = await prisma.users.findUnique({
      where: { id },
      include: INCLUDE_ROLES,
    });
    if (!found) return null;
    return toUser(found);
  }

  async assignRole(userId: string, roleId: string): Promise<void> {
    await prisma.user_roles.create({
      data: { id: randomUUID(), user_id: userId, role_id: roleId },
    });
  }
}
