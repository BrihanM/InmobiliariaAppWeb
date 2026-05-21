import { apiClient } from '@/core/api/axios.instance';
import type { Property } from '@/features/properties/domain/entities/Property.entity';
import type { ApiResponse, PaginatedResponse } from '@/shared/types/common.types';

export interface PropertyFilters {
  city?: string;
  type?: Property['type'];
  status?: Property['status'];
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}

export const propertyRepository = {
  getAll: async (filters: PropertyFilters = {}): Promise<PaginatedResponse<Property>> => {
    const { data } = await apiClient.get<PaginatedResponse<Property>>('/properties', {
      params: filters,
    });
    return data;
  },

  getById: async (id: string): Promise<Property> => {
    const { data } = await apiClient.get<ApiResponse<Property>>(`/properties/${id}`);
    return data.data;
  },

  create: async (payload: Omit<Property, 'id' | 'createdAt'>): Promise<Property> => {
    const { data } = await apiClient.post<ApiResponse<Property>>('/properties', payload);
    return data.data;
  },

  update: async (id: string, payload: Partial<Property>): Promise<Property> => {
    const { data } = await apiClient.patch<ApiResponse<Property>>(`/properties/${id}`, payload);
    return data.data;
  },

  remove: async (id: string): Promise<void> => {
    await apiClient.delete(`/properties/${id}`);
  },
};
