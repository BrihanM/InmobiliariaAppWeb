import type { AxiosInstance } from 'axios';
import { useAuthStore } from '@/features/auth/store/authStore';

export function attachAuthInterceptor(client: AxiosInstance) {
  client.interceptors.request.use((config) => {
    const tokens = useAuthStore.getState().tokens;
    if (tokens?.accessToken) {
      config.headers['Authorization'] = `Bearer ${tokens.accessToken}`;
    }
    return config;
  });
}
