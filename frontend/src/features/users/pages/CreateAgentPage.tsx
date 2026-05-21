import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/shared/components/layouts/DashboardLayout';
import { Input } from '@/shared/components/ui/Input';
import { Button } from '@/shared/components/ui/Button';
import { createAgentSchema, type CreateAgentFormValues } from '../schemas';
import { useCreateAgent } from '../hooks/useCreateAgent';

export default function CreateAgentPage() {
  const navigate = useNavigate();
  const { mutateAsync: createAgent, isPending, isError, error } = useCreateAgent();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateAgentFormValues>({
    resolver: zodResolver(createAgentSchema),
  });

  async function onSubmit(values: CreateAgentFormValues) {
    await createAgent({
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      password: values.password,
    });
    navigate('/dashboard/users');
  }

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-lg space-y-6"
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard/users')}
            className="text-sm text-gray-400 hover:text-gray-700 transition-colors"
          >
            ←
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Crear agente</h1>
            <p className="text-sm text-gray-400">
              El usuario se creará con rol Agente inmobiliario
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4">
          {/* Role preview */}
          <div className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl">
            <span className="text-2xl">🏠</span>
            <div>
              <p className="text-sm font-semibold text-amber-800">Rol: Agente</p>
              <p className="text-xs text-amber-600">
                Tendrá acceso para gestionar propiedades en la plataforma
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Nombre"
                {...register('firstName')}
                error={errors.firstName?.message}
                placeholder="Carlos"
              />
              <Input
                label="Apellido"
                {...register('lastName')}
                error={errors.lastName?.message}
                placeholder="Ramírez"
              />
            </div>

            <Input
              label="Email corporativo"
              type="email"
              {...register('email')}
              error={errors.email?.message}
              placeholder="agente@inmobiliaria.co"
            />

            <Input
              label="Contraseña temporal"
              type="password"
              {...register('password')}
              error={errors.password?.message}
              placeholder="Mínimo 8 caracteres"
            />

            <Input
              label="Confirmar contraseña"
              type="password"
              {...register('confirmPassword')}
              error={errors.confirmPassword?.message}
              placeholder="Repite la contraseña"
            />

            {isError && (
              <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                {(error as Error)?.message ?? 'Error al crear el agente. Verifica que el email no esté registrado.'}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" onClick={() => navigate('/dashboard/users')}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Creando agente...' : '✓ Crear agente'}
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
