import { useQuery } from '@tanstack/react-query';
import { landingPropertiesApi } from '../api/propertiesApi';

export function useFeaturedProperties() {
  return useQuery({
    queryKey: ['landing', 'featured'],
    queryFn: () =>
      landingPropertiesApi.getProperties({ status: 'available', limit: 6, sort: 'price' }),
    staleTime: 5 * 60 * 1000,
  });
}
