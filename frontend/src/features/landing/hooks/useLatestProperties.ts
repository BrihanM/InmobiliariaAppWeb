import { useInfiniteQuery } from '@tanstack/react-query';
import { landingPropertiesApi } from '../api/propertiesApi';

export function useLatestProperties() {
  return useInfiniteQuery({
    queryKey: ['landing', 'latest'],
    queryFn: ({ pageParam }) =>
      landingPropertiesApi.getProperties({
        status: 'available',
        limit: 8,
        page: pageParam,
        sort: 'createdAt',
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
    staleTime: 5 * 60 * 1000,
  });
}
