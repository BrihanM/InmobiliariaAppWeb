import { Link } from 'react-router-dom';
import { useSession } from '@/features/auth/hooks/useSession';
import { useCreateProperty } from '../hooks/useCreateProperty';
import { PropertyForm } from '../components/PropertyForm';
import { DashboardLayout } from '@/shared/components/layouts/DashboardLayout';
import type { PropertyFormValues } from '../schemas';
import type { CreatePropertyPayload } from '../types';

export default function CreatePropertyPage() {
  const { user } = useSession();
  const createProperty = useCreateProperty();

  const handleSubmit = (data: PropertyFormValues) => {
    const payload: CreatePropertyPayload = {
      ...data,
      agentId: user?.id ?? '',
    };
    createProperty.mutate(payload);
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        {/* Page header */}
        <div className="mb-8">
          <nav className="text-sm text-slate-400 mb-4 flex items-center gap-2">
            <Link to="/properties" className="hover:text-indigo-600 transition-colors">Propiedades</Link>
            <span>/</span>
            <span className="text-slate-600">Nueva propiedad</span>
          </nav>
          <h1 className="text-2xl font-bold text-slate-800">Crear nueva propiedad</h1>
          <p className="text-slate-500 text-sm mt-1">Completa la información para publicar una propiedad.</p>
        </div>

        <PropertyForm
          onSubmit={handleSubmit}
          isLoading={createProperty.isPending}
          isEdit={false}
        />

        {createProperty.isError && (
          <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
            Error al crear la propiedad. Verifica los datos e intenta de nuevo.
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
