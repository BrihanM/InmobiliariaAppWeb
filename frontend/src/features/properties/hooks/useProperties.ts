import { useQuery } from '@tanstack/react-query';
import { propertiesApi } from '../api/propertiesApi';
import { PROPERTIES_QUERY_KEY } from '../types';
import type { PropertyFilters } from '../types';

export function useProperties(filters: PropertyFilters = {}) {
  return useQuery({
    queryKey: [PROPERTIES_QUERY_KEY, 'list', filters],
    queryFn: () => propertiesApi.getAll(filters),
    staleTime: 2 * 60 * 1000,
  });
}
