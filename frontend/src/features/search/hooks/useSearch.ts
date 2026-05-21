import { useQuery } from '@tanstack/react-query';
import { searchApi } from '../api/searchApi';
import { SEARCH_QUERY_KEY, DEFAULT_LIMIT } from '../types';
import type { SearchParams } from '../types';

export function useSearch(params: SearchParams) {
  return useQuery({
    queryKey: [SEARCH_QUERY_KEY, params],
    queryFn: () => searchApi.search({ limit: DEFAULT_LIMIT, ...params }),
    staleTime: 30_000,
    placeholderData: (prev) => prev,
  });
}
