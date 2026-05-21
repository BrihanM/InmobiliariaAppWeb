import { useQuery } from '@tanstack/react-query';
import { propertiesApi } from '../api/propertiesApi';
import { PROPERTIES_QUERY_KEY } from '../types';

export function useProperty(id: string | undefined) {
  return useQuery({
    queryKey: [PROPERTIES_QUERY_KEY, 'detail', id],
    queryFn: () => propertiesApi.getById(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}
