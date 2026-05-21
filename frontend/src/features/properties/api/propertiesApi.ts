import { apiClient } from '@/core/api/axios.instance';
import type { ApiResponse, PaginatedResponse } from '@/shared/types/common.types';
import type { Property, PropertyFilters, CreatePropertyPayload, UpdatePropertyPayload } from '../types';

export const propertiesApi = {
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

  create: async (payload: CreatePropertyPayload): Promise<Property> => {
    const { data } = await apiClient.post<ApiResponse<Property>>('/properties', payload);
    return data.data;
  },

  update: async (id: string, payload: UpdatePropertyPayload): Promise<Property> => {
    const { data } = await apiClient.patch<ApiResponse<Property>>(`/properties/${id}`, payload);
    return data.data;
  },

  remove: async (id: string): Promise<void> => {
    await apiClient.delete(`/properties/${id}`);
  },

  uploadImage: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await apiClient.post<ApiResponse<{ url: string }>>(
      '/properties/upload-image',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    );
    return data.data.url;
  },
};
