import { useQuery } from '@tanstack/react-query';
import { landingSearchApi } from '../api/searchApi';
import type { SearchFilters } from '../types';

export function usePropertySearch(filters: SearchFilters, enabled: boolean) {
  return useQuery({
    queryKey: ['landing', 'search', filters],
    queryFn: () => landingSearchApi.search(filters),
    enabled,
    staleTime: 60 * 1000,
  });
}
