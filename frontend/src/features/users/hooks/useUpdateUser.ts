import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '../api/usersApi';
import { USERS_QUERY_KEY } from '../types';
import type { UpdateUserPayload } from '../types';

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateUserPayload }) =>
      usersApi.update(id, payload),
    onSuccess: (_, { id }) => {
      void queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] });
      void queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY, 'detail', id] });
    },
  });
}
