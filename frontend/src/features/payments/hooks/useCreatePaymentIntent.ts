import { useMutation } from '@tanstack/react-query';
import { paymentsApi } from '../api/paymentsApi';
import type { PaymentIntentRequest } from '../types';

export function useCreatePaymentIntent() {
  return useMutation({
    mutationFn: (data: PaymentIntentRequest) => paymentsApi.createIntent(data),
  });
}
