import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/shared/components/ui/Modal';
import { Button } from '@/shared/components/ui/Button';
import { UserForm } from './UserForm';
import { UserRoleBadge } from './UserRoleBadge';
import { patchRolesSchema, type PatchRolesFormValues } from '../schemas';
import { ALL_ROLES, ROLE_LABELS, getUserFullName } from '../utils/userHelpers';
import { useUser } from '../hooks/useUser';
import { useUpdateUser } from '../hooks/useUpdateUser';
import { usePatchRoles } from '../hooks/usePatchRoles';
import { useDeleteUser } from '../hooks/useDeleteUser';
import { useUsersStore } from '../store/usersStore';
import type { UpdateUserFormValues } from '../schemas';
import type { UserRole } from '../types';

// ─── Edit Modal ────────────────────────────────────────────────────────────────
export function EditUserModal() {
  const { selectedUserId, isEditModalOpen, closeEditModal } = useUsersStore();
  const { data: user } = useUser(isEditModalOpen ? selectedUserId : null);
  const { mutateAsync: updateUser, isPending } = useUpdateUser();

  async function handleSubmit(values: UpdateUserFormValues) {
    if (!selectedUserId) return;
    await updateUser({ id: selectedUserId, payload: values });
    closeEditModal();
  }

  return (
    <Modal isOpen={isEditModalOpen} onClose={closeEditModal} title="Editar usuario">
      {user ? (
        <UserForm user={user} onSubmit={handleSubmit} isLoading={isPending} />
      ) : (
        <div className="py-8 text-center text-gray-400 text-sm">Cargando...</div>
      )}
    </Modal>
  );
}

// ─── Role Modal ────────────────────────────────────────────────────────────────
export function RoleModal() {
  const { selectedUserId, isRoleModalOpen, closeRoleModal } = useUsersStore();
  const { data: user } = useUser(isRoleModalOpen ? selectedUserId : null);
  const { mutateAsync: patchRoles, isPending } = usePatchRoles();

  const { register, handleSubmit, formState: { errors } } = useForm<PatchRolesFormValues>({
    resolver: zodResolver(patchRolesSchema),
    defaultValues: { role: user?.role ?? 'CLIENT' },
  });

  async function handleSave(values: PatchRolesFormValues) {
    if (!selectedUserId) return;
    await patchRoles({ id: selectedUserId, roles: [values.role as UserRole] });
    closeRoleModal();
  }

  return (
    <Modal isOpen={isRoleModalOpen} onClose={closeRoleModal} title="Cambiar rol">
      {user && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 pb-1">
            <div className="text-sm font-medium text-gray-700">{getUserFullName(user)}</div>
            <UserRoleBadge role={user.role} size="sm" />
          </div>

          <form onSubmit={handleSubmit(handleSave)} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Nuevo rol</label>
              <div className="grid grid-cols-3 gap-2">
                {ALL_ROLES.map((r) => (
                  <label
                    key={r}
                    className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-gray-200 cursor-pointer hover:border-indigo-300 hover:bg-indigo-50/40 transition-colors has-[:checked]:border-indigo-500 has-[:checked]:bg-indigo-50"
                  >
                    <input type="radio" value={r} {...register('role')} className="sr-only" />
                    <UserRoleBadge role={r} size="sm" />
                    <span className="text-xs text-gray-500">{ROLE_LABELS[r]}</span>
                  </label>
                ))}
              </div>
              {errors.role && <p className="text-xs text-red-500">{errors.role.message}</p>}
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="secondary" type="button" onClick={closeRoleModal}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Guardando...' : 'Confirmar'}
              </Button>
            </div>
          </form>
        </div>
      )}
    </Modal>
  );
}

// ─── Delete Confirm Modal ──────────────────────────────────────────────────────
export function DeleteUserModal() {
  const { selectedUserId, isDeleteModalOpen, closeDeleteModal } = useUsersStore();
  const { data: user } = useUser(isDeleteModalOpen ? selectedUserId : null);
  const { mutateAsync: deleteUser, isPending } = useDeleteUser();

  async function handleConfirm() {
    if (!selectedUserId) return;
    await deleteUser(selectedUserId);
    closeDeleteModal();
  }

  return (
    <Modal isOpen={isDeleteModalOpen} onClose={closeDeleteModal} title="Eliminar usuario">
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          ¿Estás seguro de que deseas eliminar a{' '}
          <span className="font-semibold text-gray-800">
            {user ? getUserFullName(user) : '...'}
          </span>
          ? Esta acción realizará una eliminación lógica.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={closeDeleteModal}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleConfirm} disabled={isPending}>
            {isPending ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
