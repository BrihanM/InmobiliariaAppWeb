import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/shared/components/layouts/DashboardLayout';
import { MainLayout } from '@/shared/components/layouts/MainLayout';
import { Button } from '@/shared/components/ui/Button';
import { UserForm } from '../components/UserForm';
import { UserRoleBadge } from '../components/UserRoleBadge';
import { UserStatusBadge } from '../components/UserStatusBadge';
import { useUser } from '../hooks/useUser';
import { useUpdateUser } from '../hooks/useUpdateUser';
import { useSession } from '@/features/auth/hooks/useSession';
import { getUserFullName, getUserInitials, getUserStatus, buildAvatarColor, formatDate } from '../utils/userHelpers';
import { Spinner } from '@/shared/components/ui/Spinner';
import type { BackendUser, UserRole } from '../types';
import type { UpdateUserFormValues } from '../schemas';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user: authUser, isClient } = useSession();
  const { data: apiUser, isLoading } = useUser(authUser?.id ?? null);
  const { mutateAsync: updateUser, isPending, isSuccess } = useUpdateUser();

  // Build a fallback user from the auth-store data so the page never hangs
  // waiting for the user-service when it isn't accessible.
  const authFallback: BackendUser | null = authUser
    ? {
        id: authUser.id,
        email: authUser.email,
        firstName: authUser.name.split(' ')[0] ?? authUser.name,
        lastName: authUser.name.split(' ').slice(1).join(' '),
        role: authUser.role,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    : null;

  const user = apiUser ?? authFallback;

  async function handleSubmit(values: UpdateUserFormValues) {
    if (!authUser?.id) return;
    await updateUser({ id: authUser.id, payload: values });
  }

  const Layout = isClient ? MainLayout : DashboardLayout;

  // Only show spinner when actually loading AND no fallback user exists
  if (isLoading && !user) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <Spinner size="lg" />
        </div>
      </Layout>
    );
  }

  if (!user) return null;

  const status = getUserStatus(user);
  const initials = getUserInitials(user);
  const avatarBg = buildAvatarColor(user.id);

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-2xl space-y-6"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mi perfil</h1>
          <p className="text-sm text-gray-400 mt-0.5">Gestiona tu información personal</p>
        </div>

        {/* Profile header */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-5 mb-6">
            <div
              className={`h-20 w-20 rounded-2xl ${avatarBg} flex items-center justify-center text-white text-2xl font-bold shrink-0`}
            >
              {initials}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{getUserFullName(user)}</h2>
              <p className="text-sm text-gray-400">{user.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <UserRoleBadge role={authUser?.role as UserRole | undefined} />
                <UserStatusBadge status={status} />
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
            <div>
              <p className="text-xs text-gray-400">Miembro desde</p>
              <p className="text-sm font-medium text-gray-800 mt-0.5">{formatDate(user.createdAt)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Última actualización</p>
              <p className="text-sm font-medium text-gray-800 mt-0.5">{formatDate(user.updatedAt)}</p>
            </div>
          </div>
        </div>

        {/* Edit form */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Editar información</h3>

          {isSuccess && (
            <div className="mb-4 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700">
              ✓ Perfil actualizado correctamente
            </div>
          )}

          <UserForm user={user} onSubmit={handleSubmit} isLoading={isPending} />
        </div>

        <div>
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            ← Volver
          </Button>
        </div>
      </motion.div>
    </Layout>
  );
}
