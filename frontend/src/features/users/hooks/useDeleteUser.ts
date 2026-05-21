import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '../api/usersApi';
import { USERS_QUERY_KEY } from '../types';

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => usersApi.remove(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] });
    },
  });
}
