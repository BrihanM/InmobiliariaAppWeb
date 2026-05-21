import axios, { type AxiosInstance, type AxiosError } from 'axios';
import { env } from '@/core/config/env';
import { useAuthStore } from '@/features/auth/store/authStore';
import type { AuthTokens } from '@/features/auth/types';

type RequestConfig = NonNullable<AxiosError['config']> & { _retry?: boolean };

let isRefreshing = false;
let queue: Array<{ resolve: (token: string) => void; reject: (err: unknown) => void }> = [];

function flushQueue(error: unknown, token: string | null): void {
  queue.forEach(({ resolve, reject }) => (error ? reject(error) : resolve(token!)));
  queue = [];
}

export function attachErrorInterceptor(client: AxiosInstance): void {
  client.interceptors.response.use(
    (res) => res,
    async (error: AxiosError) => {
      const original = error.config as RequestConfig | undefined;

      if (error.response?.status !== 401 || original?._retry) {
        return Promise.reject(error);
      }

      const { tokens, logout } = useAuthStore.getState();

      if (!tokens?.refreshToken) {
        logout();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          queue.push({ resolve, reject });
        }).then((newToken) => {
          if (original) {
            original.headers = original.headers ?? {};
            original.headers['Authorization'] = `Bearer ${newToken}`;
            return client(original);
          }
        });
      }

      isRefreshing = true;
      if (original) original._retry = true;

      try {
        const { data } = await axios.post<AuthTokens>(
          `${env.apiUrl}/auth/refresh`,
          { refreshToken: tokens.refreshToken }
        );
        useAuthStore.getState().setTokens(data);
        flushQueue(null, data.accessToken);
        if (original) {
          original.headers = original.headers ?? {};
          original.headers['Authorization'] = `Bearer ${data.accessToken}`;
          return client(original);
        }
      } catch (refreshError) {
        flushQueue(refreshError, null);
        logout();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
  );
}
