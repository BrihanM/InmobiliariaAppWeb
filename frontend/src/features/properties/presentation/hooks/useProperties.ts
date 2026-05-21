import { useQuery } from '@tanstack/react-query';
import { propertyRepository, type PropertyFilters } from '@/features/properties/infrastructure/repositories/property.repository';

export const PROPERTIES_QUERY_KEY = 'properties';

export function useProperties(filters: PropertyFilters = {}) {
  return useQuery({
    queryKey: [PROPERTIES_QUERY_KEY, filters],
    queryFn: () => propertyRepository.getAll(filters),
  });
}

export function useProperty(id: string) {
  return useQuery({
    queryKey: [PROPERTIES_QUERY_KEY, id],
    queryFn: () => propertyRepository.getById(id),
    enabled: !!id,
  });
}
