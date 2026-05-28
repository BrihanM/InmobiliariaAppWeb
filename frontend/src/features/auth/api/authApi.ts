import { apiClient } from '@/core/api/axios.instance';
import type {
  AuthResponse,
  AuthTokens,
  ForgotPasswordRequest,
  LoginRequest,
  RegisterRequest,
  User,
} from '../types';

export const authApi = {
  login: (data: LoginRequest): Promise<AuthResponse> =>
    apiClient.post<AuthResponse>('/auth/login', data).then((r) => r.data),

  register: (data: RegisterRequest): Promise<AuthResponse> =>
    apiClient.post<AuthResponse>('/auth/register', data).then((r) => r.data),

  logout: (refreshToken?: string): Promise<void> =>
    apiClient.post('/auth/logout', refreshToken ? { refreshToken } : {}).then(() => undefined),

  refreshToken: (refreshToken: string): Promise<AuthTokens> =>
    apiClient.post<AuthTokens>('/auth/refresh', { refreshToken }).then((r) => r.data),

  forgotPassword: (data: ForgotPasswordRequest): Promise<void> =>
    apiClient.post('/auth/forgot-password', data).then(() => undefined),

  getMe: (): Promise<User> =>
    apiClient.get<User>('/auth/me').then((r) => r.data),
};
