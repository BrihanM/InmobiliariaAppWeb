import { apiClient } from '@/core/api/axios.instance';
import type {
  BackendUser,
  UsersListResponse,
  UserFilters,
  UpdateUserPayload,
  PatchRolesPayload,
} from '../types';

export const usersApi = {
  getAll: async (filters: UserFilters = {}): Promise<UsersListResponse> => {
    const params: Record<string, string | number> = {};
    if (filters.email) params.email = filters.email;
    if (filters.firstName) params.firstName = filters.firstName;
    if (filters.role) params.role = filters.role;
    if (filters.page) params.page = filters.page;
    if (filters.pageSize) params.pageSize = filters.pageSize;

    const { data } = await apiClient.get<UsersListResponse>('/users', { params });
    return data;
  },

  getById: async (id: string): Promise<BackendUser> => {
    const { data } = await apiClient.get<BackendUser>(`/users/${id}`);
    return data;
  },

  update: async (id: string, payload: UpdateUserPayload): Promise<BackendUser> => {
    const { data } = await apiClient.put<BackendUser>(`/users/${id}`, payload);
    return data;
  },

  remove: async (id: string): Promise<void> => {
    await apiClient.delete(`/users/${id}`);
  },

  patchRoles: async (id: string, payload: PatchRolesPayload): Promise<void> => {
    await apiClient.patch(`/users/${id}/roles`, payload);
  },
};
