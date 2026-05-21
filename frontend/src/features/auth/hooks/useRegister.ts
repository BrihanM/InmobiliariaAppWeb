import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { parseApiError } from '@/core/errors/AppError';
import type { RegisterFormValues } from '../schemas';

export function useRegister() {
  const navigate = useNavigate();

  const { mutateAsync, isPending, error, reset } = useMutation({
    mutationFn: (data: RegisterFormValues) =>
      authService.register({
        name: data.name,
        email: data.email,
        password: data.password,
        role: 'CLIENT',
      }),
    onSuccess: () => navigate('/dashboard'),
  });

  return {
    register: mutateAsync,
    isLoading: isPending,
    error: error ? parseApiError(error) : null,
    reset,
  };
}
