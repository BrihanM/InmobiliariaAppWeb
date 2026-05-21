import { apiClient } from '@/core/api/axios.instance';
import type { Property } from '@/features/properties/domain/entities/Property.entity';
import type { PaginatedResponse } from '@/shared/types/common.types';

export interface PropertyQuery {
  type?: Property['type'];
  status?: Property['status'];
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
  sort?: string;
}

export const landingPropertiesApi = {
  getProperties: async (params: PropertyQuery = {}): Promise<PaginatedResponse<Property>> => {
    const { data } = await apiClient.get<PaginatedResponse<Property>>('/properties', { params });
    return data;
  },
};
