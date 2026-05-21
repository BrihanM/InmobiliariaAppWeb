import { apiClient } from '@/core/api/axios.instance';
import type { PaginatedResponse } from '@/shared/types/common.types';
import type { Property } from '@/features/properties/types';
import type { SearchParams } from '../types';

export const searchApi = {
  search: async (params: SearchParams): Promise<PaginatedResponse<Property>> => {
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([, v]) => v !== '' && v !== undefined && v !== null),
    );
    const { data } = await apiClient.get<PaginatedResponse<Property>>('/search', {
      params: cleanParams,
    });
    return data;
  },
};
