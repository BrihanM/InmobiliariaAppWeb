import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { loginSchema, type LoginFormValues } from '../schemas';
import { useLogin } from '../hooks/useLogin';
import { PasswordInput } from './PasswordInput';
import { Input } from '@/shared/components/ui/Input';
import { Button } from '@/shared/components/ui/Button';

export function LoginForm() {
  const { login, isLoading, error } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  return (
    <form onSubmit={handleSubmit((data) => login(data))} className="space-y-4" noValidate>
      <Input
        label="Correo electrónico"
        type="email"
        placeholder="nombre@ejemplo.com"
        autoComplete="email"
        error={errors.email?.message}
        {...register('email')}
      />

      <div>
        <PasswordInput
          label="Contraseña"
          placeholder="••••••••"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register('password')}
        />
        <div className="flex justify-end mt-1.5">
          <Link
            to="/forgot-password"
            className="text-xs text-blue-600 hover:text-blue-700 hover:underline"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <Button type="submit" disabled={isLoading} className="w-full" size="lg">
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            Iniciando sesión…
          </span>
        ) : (
          'Iniciar sesión'
        )}
      </Button>
    </form>
  );
}
