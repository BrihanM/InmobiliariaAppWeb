import type { BackendUser, UserRole, UserStatus } from '../types';

export function getUserFullName(user: BackendUser): string {
  const first = user.firstName?.trim() ?? '';
  const last = user.lastName?.trim() ?? '';
  if (first && last) return `${first} ${last}`;
  if (first) return first;
  if (last) return last;
  return user.email.split('@')[0];
}

export function getUserInitials(user: BackendUser): string {
  const name = getUserFullName(user);
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function getUserStatus(user: BackendUser): UserStatus {
  return user.deletedAt ? 'inactive' : 'active';
}

export const ROLE_LABELS: Record<UserRole, string> = {
  ADMIN: 'Administrador',
  AGENT: 'Agente',
  CLIENT: 'Cliente',
};

export const ROLE_ORDER: Record<UserRole, number> = {
  ADMIN: 0,
  AGENT: 1,
  CLIENT: 2,
};

export const ALL_ROLES: UserRole[] = ['ADMIN', 'AGENT', 'CLIENT'];

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function buildAvatarColor(userId: string): string {
  const colors = [
    'bg-indigo-500',
    'bg-amber-500',
    'bg-emerald-500',
    'bg-rose-500',
    'bg-violet-500',
    'bg-sky-500',
    'bg-orange-500',
    'bg-teal-500',
  ];
  const index = userId.charCodeAt(0) % colors.length;
  return colors[index];
}
