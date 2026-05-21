import axios from 'axios';
import { env } from '@/core/config/env';
import { attachAuthInterceptor } from './interceptors/auth.interceptor';
import { attachErrorInterceptor } from './interceptors/error.interceptor';

export const apiClient = axios.create({
  baseURL: env.apiUrl,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15_000,
});

attachAuthInterceptor(apiClient);
attachErrorInterceptor(apiClient);
