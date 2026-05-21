import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterFormValues } from '../schemas';
import { useRegister } from '../hooks/useRegister';
import { PasswordInput } from './PasswordInput';
import { RoleSelector } from './RoleSelector';
import { Input } from '@/shared/components/ui/Input';
import { Button } from '@/shared/components/ui/Button';

export function RegisterForm() {
  const { register: doRegister, isLoading, error } = useRegister();

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'CLIENT' as const },
  });

  const passwordValue = watch('password') ?? '';

  return (
    <form onSubmit={handleSubmit((data) => doRegister(data))} className="space-y-4" noValidate>
      <Input
        label="Nombre completo"
        placeholder="Juan Pérez"
        autoComplete="name"
        error={errors.name?.message}
        {...register('name')}
      />

      <Input
        label="Correo electrónico"
        type="email"
        placeholder="nombre@ejemplo.com"
        autoComplete="email"
        error={errors.email?.message}
        {...register('email')}
      />

      <PasswordInput
        label="Contraseña"
        placeholder="••••••••"
        autoComplete="new-password"
        strengthValue={passwordValue}
        error={errors.password?.message}
        {...register('password')}
      />

      <PasswordInput
        label="Confirmar contraseña"
        placeholder="••••••••"
        autoComplete="new-password"
        error={errors.confirmPassword?.message}
        {...register('confirmPassword')}
      />

      <Controller
        name="role"
        control={control}
        render={({ field }) => (
          <RoleSelector
            value={field.value}
            onChange={field.onChange}
            error={errors.role?.message}
          />
        )}
      />

      {error && (
        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <Button type="submit" disabled={isLoading} className="w-full" size="lg">
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            Creando cuenta…
          </span>
        ) : (
          'Crear cuenta'
        )}
      </Button>
    </form>
  );
}
