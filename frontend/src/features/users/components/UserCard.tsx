import { useNavigate } from 'react-router-dom';
import type { BackendUser } from '../types';
import { UserRoleBadge } from './UserRoleBadge';
import { UserStatusBadge } from './UserStatusBadge';
import {
  getUserFullName,
  getUserInitials,
  getUserStatus,
  buildAvatarColor,
  formatDate,
} from '../utils/userHelpers';

interface UserCardProps {
  user: BackendUser;
}

export function UserCard({ user }: UserCardProps) {
  const navigate = useNavigate();
  const status = getUserStatus(user);
  const initials = getUserInitials(user);
  const avatarBg = buildAvatarColor(user.id);

  return (
    <div
      onClick={() => navigate(`/dashboard/users/${user.id}`)}
      className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col gap-3 cursor-pointer hover:shadow-md hover:border-indigo-100 transition-all group"
    >
      <div className="flex items-start justify-between">
        <div
          className={`h-11 w-11 rounded-full ${avatarBg} flex items-center justify-center text-white text-sm font-bold`}
        >
          {initials}
        </div>
        <UserStatusBadge status={status} />
      </div>

      <div>
        <p className="text-sm font-semibold text-gray-800 group-hover:text-indigo-700 transition-colors">
          {getUserFullName(user)}
        </p>
        <p className="text-xs text-gray-400 mt-0.5 truncate">{user.email}</p>
      </div>

      <div className="flex items-center justify-between pt-1 border-t border-gray-50">
        <UserRoleBadge role={user.role} size="sm" />
        <span className="text-xs text-gray-300">{formatDate(user.createdAt)}</span>
      </div>
    </div>
  );
}
