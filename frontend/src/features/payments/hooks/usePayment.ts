import { useQuery } from '@tanstack/react-query';
import { paymentsApi } from '../api/paymentsApi';
import { PAYMENTS_QUERY_KEY } from '../types';

export function usePayment(id: string | undefined) {
  return useQuery({
    queryKey: [PAYMENTS_QUERY_KEY, id],
    queryFn: () => paymentsApi.getById(id!),
    enabled: !!id,
  });
}
