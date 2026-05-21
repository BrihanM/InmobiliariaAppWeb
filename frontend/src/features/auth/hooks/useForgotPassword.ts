import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/authService';
import { parseApiError } from '@/core/errors/AppError';
import type { ForgotPasswordFormValues } from '../schemas';

export function useForgotPassword() {
  const { mutateAsync, isPending, isSuccess, error, reset } = useMutation({
    mutationFn: (data: ForgotPasswordFormValues) => authService.forgotPassword(data),
  });

  return {
    forgotPassword: mutateAsync,
    isLoading: isPending,
    isSuccess,
    error: error ? parseApiError(error) : null,
    reset,
  };
}
