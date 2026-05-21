import { Link, useParams } from 'react-router-dom';
import { useProperty } from '../hooks/useProperty';
import { useUpdateProperty } from '../hooks/useUpdateProperty';
import { PropertyForm } from '../components/PropertyForm';
import { DashboardLayout } from '@/shared/components/layouts/DashboardLayout';
import { Spinner } from '@/shared/components/ui/Spinner';
import type { PropertyFormValues } from '../schemas';

export default function EditPropertyPage() {
  const { id } = useParams<{ id: string }>();
  const { data: property, isLoading, isError } = useProperty(id);
  const updateProperty = useUpdateProperty(id ?? '');

  const handleSubmit = (data: PropertyFormValues) => {
    updateProperty.mutate(data);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-24">
          <Spinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  if (isError || !property) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <p className="text-slate-500">No se pudo cargar la propiedad.</p>
          <Link to="/properties" className="text-indigo-600 hover:underline text-sm">
            Volver a propiedades
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  // Map Property entity → form defaults (only form-compatible fields)
  const defaultValues: Partial<PropertyFormValues> = {
    title: property.title,
    description: property.description,
    price: property.price,
    currency: property.currency,
    type: property.type,
    status: property.status,
    address: property.address,
    city: property.city,
    state: property.state,
    country: property.country,
    bedrooms: property.bedrooms ?? 0,
    bathrooms: property.bathrooms ?? 0,
    area: property.area,
    images: property.images,
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        {/* Page header */}
        <div className="mb-8">
          <nav className="text-sm text-slate-400 mb-4 flex items-center gap-2">
            <Link to="/properties" className="hover:text-indigo-600 transition-colors">Propiedades</Link>
            <span>/</span>
            <Link
              to={`/properties/${property.id}`}
              className="hover:text-indigo-600 transition-colors truncate max-w-[200px]"
            >
              {property.title}
            </Link>
            <span>/</span>
            <span className="text-slate-600">Editar</span>
          </nav>
          <h1 className="text-2xl font-bold text-slate-800">Editar propiedad</h1>
          <p className="text-slate-500 text-sm mt-1">Actualiza la información de la propiedad.</p>
        </div>

        <PropertyForm
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          isLoading={updateProperty.isPending}
          isEdit={true}
        />

        {updateProperty.isError && (
          <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
            Error al actualizar la propiedad. Verifica los datos e intenta de nuevo.
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
