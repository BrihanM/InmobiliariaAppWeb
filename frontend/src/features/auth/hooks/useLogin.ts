import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { parseApiError } from '@/core/errors/AppError';
import type { LoginFormValues } from '../schemas';

export function useLogin() {
  const navigate = useNavigate();

  const { mutateAsync, isPending, error, reset } = useMutation({
    mutationFn: (data: LoginFormValues) => authService.login(data),
    onSuccess: () => navigate('/dashboard'),
  });

  return {
    login: mutateAsync,
    isLoading: isPending,
    error: error ? parseApiError(error) : null,
    reset,
  };
}
