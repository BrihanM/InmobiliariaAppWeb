import { useQuery } from '@tanstack/react-query';
import { paymentsApi } from '../api/paymentsApi';
import { PAYMENTS_QUERY_KEY } from '../types';
import type { PaymentFilters } from '../types';

export function usePayments(filters: PaymentFilters = {}) {
  return useQuery({
    queryKey: [PAYMENTS_QUERY_KEY, 'history', filters],
    queryFn: () => paymentsApi.getHistory(filters),
    placeholderData: (prev) => prev,
    staleTime: 30_000,
  });
}
