export const USERS_QUERY_KEY = 'users' as const;

export type UserRole = 'ADMIN' | 'AGENT' | 'CLIENT';
export type UserStatus = 'active' | 'inactive';

export interface BackendUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone?: string | null;
  status?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  role?: UserRole | null;
}

export interface UsersListResponse {
  data: BackendUser[];
  total: number;
}

export interface UserFilters {
  email?: string;
  firstName?: string;
  role?: UserRole | '';
  page?: number;
  pageSize?: number;
}

export interface UpdateUserPayload {
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface PatchRolesPayload {
  roles: UserRole[];
}

export interface CreateAgentPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
