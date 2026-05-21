import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/shared/components/layouts/DashboardLayout';
import { Button } from '@/shared/components/ui/Button';
import { Spinner } from '@/shared/components/ui/Spinner';
import { UserForm } from '../components/UserForm';
import { useUser } from '../hooks/useUser';
import { useUpdateUser } from '../hooks/useUpdateUser';
import type { UpdateUserFormValues } from '../schemas';

export default function EditUserPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: user, isLoading } = useUser(id ?? null);
  const { mutateAsync: updateUser, isPending } = useUpdateUser();

  async function handleSubmit(values: UpdateUserFormValues) {
    if (!id) return;
    await updateUser({ id, payload: values });
    navigate(`/dashboard/users/${id}`);
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Spinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  if (!user) {
    return (
      <DashboardLayout>
        <div className="text-center py-20 text-gray-400">Usuario no encontrado</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-lg space-y-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-gray-400 hover:text-gray-700 transition-colors"
          >
            ←
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Editar usuario</h1>
            <p className="text-sm text-gray-400">Modifica los datos del usuario</p>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <UserForm user={user} onSubmit={handleSubmit} isLoading={isPending} />
        </div>

        <div className="flex">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            Cancelar
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
