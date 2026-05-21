import type { UserStatus } from '../types';

interface UserStatusBadgeProps {
  status: UserStatus;
}

const statusConfig: Record<UserStatus, { label: string; classes: string; dot: string }> = {
  active: {
    label: 'Activo',
    classes: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-500',
  },
  inactive: {
    label: 'Inactivo',
    classes: 'bg-red-50 text-red-600 border-red-200',
    dot: 'bg-red-400',
  },
};

export function UserStatusBadge({ status }: UserStatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${config.classes}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}
