import type { UserRole } from '../types';
import { ROLE_LABELS } from '../utils/userHelpers';

interface UserRoleBadgeProps {
  role?: UserRole | null;
  size?: 'sm' | 'md';
}

const roleStyles: Record<UserRole, string> = {
  ADMIN: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  AGENT: 'bg-amber-100 text-amber-700 border-amber-200',
  CLIENT: 'bg-gray-100 text-gray-600 border-gray-200',
};

const roleIcons: Record<UserRole, string> = {
  ADMIN: '⚡',
  AGENT: '🏠',
  CLIENT: '👤',
};

export function UserRoleBadge({ role, size = 'md' }: UserRoleBadgeProps) {
  if (!role) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium bg-gray-50 text-gray-400 border-gray-200">
        Sin rol
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border font-medium ${roleStyles[role]} ${
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
      }`}
    >
      <span>{roleIcons[role]}</span>
      {ROLE_LABELS[role]}
    </span>
  );
}
