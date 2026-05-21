import { useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentsApi } from '../api/paymentsApi';
import { PAYMENTS_QUERY_KEY } from '../types';
import type { ConfirmPaymentRequest } from '../types';

export function useConfirmPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ConfirmPaymentRequest) => paymentsApi.confirm(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PAYMENTS_QUERY_KEY] });
    },
  });
}
