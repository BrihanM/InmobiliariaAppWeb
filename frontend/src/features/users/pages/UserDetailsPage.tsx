import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/shared/components/layouts/DashboardLayout';
import { Button } from '@/shared/components/ui/Button';
import { Spinner } from '@/shared/components/ui/Spinner';
import { UserRoleBadge } from '../components/UserRoleBadge';
import { UserStatusBadge } from '../components/UserStatusBadge';
import { EditUserModal, RoleModal, DeleteUserModal } from '../components/UserModal';
import { useUser } from '../hooks/useUser';
import { useUsersStore } from '../store/usersStore';
import { useSession } from '@/features/auth/hooks/useSession';
import { getUserFullName, getUserInitials, getUserStatus, buildAvatarColor, formatDate } from '../utils/userHelpers';

export default function UserDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAdmin } = useSession();
  const { data: user, isLoading, isError } = useUser(id ?? null);
  const { openEditModal, openRoleModal, openDeleteModal } = useUsersStore();

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Spinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  if (isError || !user) {
    return (
      <DashboardLayout>
        <div className="text-center py-20">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-gray-500">Usuario no encontrado</p>
          <Button variant="secondary" size="sm" className="mt-4" onClick={() => navigate('/dashboard/users')}>
            ← Volver
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const status = getUserStatus(user);
  const initials = getUserInitials(user);
  const avatarBg = buildAvatarColor(user.id);

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-2xl space-y-6"
      >
        {/* Back */}
        <button
          onClick={() => navigate('/dashboard/users')}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors"
        >
          ← Volver a usuarios
        </button>

        {/* Profile card */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div
                className={`h-16 w-16 rounded-2xl ${avatarBg} flex items-center justify-center text-white text-xl font-bold`}
              >
                {initials}
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{getUserFullName(user)}</h1>
                <p className="text-sm text-gray-400">{user.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <UserRoleBadge role={user.role} />
                  <UserStatusBadge status={status} />
                </div>
              </div>
            </div>

            {isAdmin && (
              <div className="flex items-center gap-2">
                <Button size="sm" variant="secondary" onClick={() => openEditModal(user.id)}>
                  Editar
                </Button>
                <Button size="sm" variant="ghost" onClick={() => openRoleModal(user.id)}>
                  Rol
                </Button>
                <Button size="sm" variant="danger" onClick={() => openDeleteModal(user.id)}>
                  Eliminar
                </Button>
              </div>
            )}
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
            {[
              { label: 'Nombre', value: user.firstName ?? '—' },
              { label: 'Apellido', value: user.lastName ?? '—' },
              { label: 'Email', value: user.email },
              { label: 'Teléfono', value: user.phone ?? '—' },
              { label: 'Rol', value: user.role ?? '—' },
              { label: 'Estado', value: status },
              { label: 'Registro', value: formatDate(user.createdAt) },
              { label: 'Actualización', value: formatDate(user.updatedAt) },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                <p className="text-sm font-medium text-gray-800">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <EditUserModal />
      <RoleModal />
      <DeleteUserModal />
    </DashboardLayout>
  );
}
