import { useQuery } from '@tanstack/react-query';
import { usersApi } from '../api/usersApi';
import { USERS_QUERY_KEY } from '../types';
import type { UserFilters } from '../types';

export function useUsers(filters: UserFilters = {}) {
  return useQuery({
    queryKey: [USERS_QUERY_KEY, 'list', filters],
    queryFn: () => usersApi.getAll(filters),
    staleTime: 30_000,
    placeholderData: (prev) => prev,
  });
}
