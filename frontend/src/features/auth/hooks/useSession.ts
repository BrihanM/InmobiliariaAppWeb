import { useAuthStore, selectUser, selectIsAuthenticated, selectUserRole } from '../store/authStore';
import type { UserRole } from '../types';

export function useSession() {
  const user = useAuthStore(selectUser);
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const role = useAuthStore(selectUserRole);

  const hasRole = (required: UserRole | UserRole[]) => {
    if (!role) return false;
    return Array.isArray(required) ? required.includes(role) : role === required;
  };

  return {
    user,
    isAuthenticated,
    role,
    hasRole,
    isAdmin: role === 'ADMIN',
    isAgent: role === 'AGENT',
    isClient: role === 'CLIENT',
  };
}
