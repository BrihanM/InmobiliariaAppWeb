import { User } from "../entities/user.entity";

export type UserFilters = { email?: string; firstName?: string; lastName?: string; role?: string };

export interface IUserRepository {
  create(user: Partial<User>): Promise<User>;
  findById(id: string): Promise<User | null>;
  findMany(filters: UserFilters, page: number, pageSize: number): Promise<{ data: User[]; total: number }>;
  update(id: string, payload: Partial<User>): Promise<User>;
  softDelete(id: string): Promise<void>;
  patchRoles(userId: string, roleIds: string[]): Promise<void>;
}
