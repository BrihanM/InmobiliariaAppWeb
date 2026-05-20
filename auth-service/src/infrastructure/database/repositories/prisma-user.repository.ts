import { IUserRepository } from "../../../domain/repositories/user.repository";
import { prisma } from "../prismaClient";
import { User } from "../../../domain/entities/user.entity";

export class PrismaUserRepository implements IUserRepository {
  /**
   * Repositorio Prisma para la entidad `User`.
   * Encapsula las operaciones CRUD necesarias por la capa de dominio.
   */
  async create(user: any): Promise<User> {
    const created = await prisma.users.create({ data: { ...user } });
    return new User({
      id: created.id,
      firstName: created.first_name,
      lastName: created.last_name,
      email: created.email,
      phone: created.phone,
      passwordHash: created.password_hash,
      status: created.status,
      createdAt: created.created_at,
      updatedAt: created.updated_at,
      deletedAt: created.deleted_at
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    const found = await prisma.users.findUnique({ where: { email } });
    if (!found) return null;
    return new User({
      id: found.id,
      firstName: found.first_name,
      lastName: found.last_name,
      email: found.email,
      phone: found.phone,
      passwordHash: found.password_hash,
      status: found.status,
      createdAt: found.created_at,
      updatedAt: found.updated_at,
      deletedAt: found.deleted_at
    });
  }

  async findById(id: string): Promise<User | null> {
    const found = await prisma.users.findUnique({ where: { id } });
    if (!found) return null;
    return new User({
      id: found.id,
      firstName: found.first_name,
      lastName: found.last_name,
      email: found.email,
      phone: found.phone,
      passwordHash: found.password_hash,
      status: found.status,
      createdAt: found.created_at,
      updatedAt: found.updated_at,
      deletedAt: found.deleted_at
    });
  }
}
