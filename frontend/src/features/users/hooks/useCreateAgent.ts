import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/core/api/axios.instance';
import { usersApi } from '../api/usersApi';
import { USERS_QUERY_KEY } from '../types';
import type { CreateAgentPayload } from '../types';

export function useCreateAgent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateAgentPayload) => {
      // 1. Register via auth-service (creates user as CLIENT)
      const { data } = await apiClient.post<{ user: { id: string } }>('/auth/register', {
        name: `${payload.firstName} ${payload.lastName}`,
        email: payload.email,
        password: payload.password,
      });

      // 2. Elevate role to AGENT via user-service
      await usersApi.patchRoles(data.user.id, { roles: ['AGENT'] });

      return data.user;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] });
    },
  });
}
