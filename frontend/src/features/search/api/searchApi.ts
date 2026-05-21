import { apiClient } from '@/core/api/axios.instance';
import type { PaginatedResponse } from '@/shared/types/common.types';
import type { Property } from '@/features/properties/types';
import type { SearchParams } from '../types';

const SORT_MAP: Record<string, string> = {
  newest: '',
  price_asc: 'price_asc',
  price_desc: 'price_desc',
  area_desc: 'area_desc',
};

export const searchApi = {
  search: async (params: SearchParams): Promise<PaginatedResponse<Property>> => {
    const { type, status, city, minPrice, maxPrice, sort, page, limit } = params;
    const mapped: Record<string, unknown> = { type, status, city, minPrice, maxPrice, page, limit };
    if (sort && SORT_MAP[sort]) mapped.sort = SORT_MAP[sort];
    const cleanParams = Object.fromEntries(
      Object.entries(mapped).filter(([, v]) => v !== '' && v !== undefined && v !== null),
    );
    const { data } = await apiClient.get<PaginatedResponse<Property>>('/properties', {
      params: cleanParams,
    });
    return data;
  },
};
