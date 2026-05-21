import { apiClient } from '@/core/api/axios.instance';
import type { ApiResponse, PaginatedResponse } from '@/shared/types/common.types';
import type {
  Payment,
  PaymentIntentRequest,
  PaymentIntentResponse,
  ConfirmPaymentRequest,
  PaymentFilters,
} from '../types';

export const paymentsApi = {
  createIntent: async (data: PaymentIntentRequest): Promise<PaymentIntentResponse> => {
    const res = await apiClient.post<ApiResponse<PaymentIntentResponse>>(
      '/payments/create-intent',
      data,
    );
    return res.data.data;
  },

  confirm: async (data: ConfirmPaymentRequest): Promise<Payment> => {
    const res = await apiClient.post<ApiResponse<Payment>>('/payments/confirm', data);
    return res.data.data;
  },

  getHistory: async (filters: PaymentFilters = {}): Promise<PaginatedResponse<Payment>> => {
    const params = Object.fromEntries(
      Object.entries(filters).filter(([, v]) => v !== undefined && v !== ''),
    );
    const res = await apiClient.get<PaginatedResponse<Payment>>('/payments/history', { params });
    return res.data;
  },

  getById: async (id: string): Promise<Payment> => {
    const res = await apiClient.get<ApiResponse<Payment>>(`/payments/${id}`);
    return res.data.data;
  },
};
