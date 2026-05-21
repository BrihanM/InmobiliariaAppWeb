import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '../api/usersApi';
import { USERS_QUERY_KEY } from '../types';
import type { UserRole } from '../types';

export function usePatchRoles() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, roles }: { id: string; roles: UserRole[] }) =>
      usersApi.patchRoles(id, { roles }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] });
    },
  });
}
