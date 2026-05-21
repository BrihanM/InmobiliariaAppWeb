import { useQuery } from '@tanstack/react-query';
import { usersApi } from '../api/usersApi';
import { USERS_QUERY_KEY } from '../types';

export function useUser(id: string | null) {
  return useQuery({
    queryKey: [USERS_QUERY_KEY, 'detail', id],
    queryFn: () => usersApi.getById(id!),
    enabled: !!id,
    staleTime: 30_000,
  });
}
