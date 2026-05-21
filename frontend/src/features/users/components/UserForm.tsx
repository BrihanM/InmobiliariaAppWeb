import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/shared/components/ui/Input';
import { Button } from '@/shared/components/ui/Button';
import { updateUserSchema, type UpdateUserFormValues } from '../schemas';
import type { BackendUser } from '../types';
import { getUserFullName } from '../utils/userHelpers';

interface UserFormProps {
  user: BackendUser;
  onSubmit: (values: UpdateUserFormValues) => Promise<void>;
  isLoading?: boolean;
}

export function UserForm({ user, onSubmit, isLoading = false }: UserFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<UpdateUserFormValues>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      firstName: user.firstName ?? '',
      lastName: user.lastName ?? '',
      email: user.email,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Avatar preview */}
      <div className="flex items-center gap-3 pb-2">
        <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
          {getUserFullName(user)
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-800">{getUserFullName(user)}</p>
          <p className="text-xs text-gray-400">{user.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Nombre"
          {...register('firstName')}
          error={errors.firstName?.message}
          placeholder="Ej: Carlos"
        />
        <Input
          label="Apellido"
          {...register('lastName')}
          error={errors.lastName?.message}
          placeholder="Ej: Ramírez"
        />
      </div>

      <Input
        label="Email"
        type="email"
        {...register('email')}
        error={errors.email?.message}
        placeholder="correo@ejemplo.com"
      />

      <div className="flex justify-end gap-2 pt-2">
        <Button type="submit" disabled={!isDirty || isLoading}>
          {isLoading ? 'Guardando...' : 'Guardar cambios'}
        </Button>
      </div>
    </form>
  );
}
