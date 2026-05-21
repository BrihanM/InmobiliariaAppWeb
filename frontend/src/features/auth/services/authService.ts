import { authApi } from '../api/authApi';
import { useAuthStore } from '../store/authStore';
import type { ForgotPasswordRequest, LoginRequest, RegisterRequest } from '../types';

export const authService = {
  async login(credentials: LoginRequest) {
    const response = await authApi.login(credentials);
    useAuthStore.getState().setAuth(response.user, response.tokens);
    return response;
  },

  async register(data: RegisterRequest) {
    const response = await authApi.register(data);
    useAuthStore.getState().setAuth(response.user, response.tokens);
    return response;
  },

  async logout() {
    try {
      await authApi.logout();
    } finally {
      useAuthStore.getState().logout();
    }
  },

  async refreshSession() {
    const { tokens } = useAuthStore.getState();
    if (!tokens?.refreshToken) throw new Error('No refresh token available');
    const newTokens = await authApi.refreshToken(tokens.refreshToken);
    useAuthStore.getState().setTokens(newTokens);
    return newTokens;
  },

  async forgotPassword(data: ForgotPasswordRequest) {
    return authApi.forgotPassword(data);
  },

  async getCurrentUser() {
    const user = await authApi.getMe();
    useAuthStore.getState().setUser(user);
    return user;
  },
};
