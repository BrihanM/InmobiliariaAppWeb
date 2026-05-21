import { DashboardLayout } from '@/shared/components/layouts/DashboardLayout';
import { useSession } from '@/features/auth/hooks/useSession';

export default function DashboardPage() {
  const { user } = useSession();

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">
        Bienvenido, {user?.name} 👋
      </h1>
      <p className="text-gray-500 mb-8">Aquí puedes gestionar toda la plataforma.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Propiedades', value: '—', icon: '🏠' },
          { label: 'Usuarios', value: '—', icon: '👥' },
          { label: 'Pagos', value: '—', icon: '💳' },
          { label: 'Búsquedas', value: '—', icon: '🔍' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm"
          >
            <div className="text-2xl mb-2">{stat.icon}</div>
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
