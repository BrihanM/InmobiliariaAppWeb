import { apiClient } from '@/core/api/axios.instance';
import type { Property } from '@/features/properties/domain/entities/Property.entity';
import type { PaginatedResponse } from '@/shared/types/common.types';
import type { SearchFilters } from '../types';

export const landingSearchApi = {
  search: async (filters: SearchFilters): Promise<PaginatedResponse<Property>> => {
    const { data } = await apiClient.get<PaginatedResponse<Property>>('/search', { params: filters });
    return data;
  },
};
