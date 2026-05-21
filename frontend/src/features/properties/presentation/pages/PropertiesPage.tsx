import { useState } from 'react';
import { useProperties } from '../hooks/useProperties';
import { PropertyCard } from '../components/PropertyCard';
import { Spinner } from '@/shared/components/ui/Spinner';
import { MainLayout } from '@/shared/components/layouts/MainLayout';
import type { Property } from '@/features/properties/domain/entities/Property.entity';

export default function PropertiesPage() {
  const [type, setType] = useState<Property['type'] | undefined>();
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useProperties({ type, page, limit: 12 });

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Propiedades</h1>

          {/* Type filter */}
          <select
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600"
            value={type ?? ''}
            onChange={(e) => {
              setType((e.target.value as Property['type']) || undefined);
              setPage(1);
            }}
          >
            <option value="">Todos los tipos</option>
            <option value="house">Casa</option>
            <option value="apartment">Apartamento</option>
            <option value="land">Terreno</option>
            <option value="commercial">Comercial</option>
          </select>
        </div>

        {isLoading && (
          <div className="flex justify-center py-20">
            <Spinner size="lg" />
          </div>
        )}

        {isError && (
          <p className="text-center text-red-500 py-20">
            Error al cargar propiedades. Intenta de nuevo.
          </p>
        )}

        {data && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {data.data.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>

            {/* Pagination */}
            {data.totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-10">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-lg border text-sm disabled:opacity-40"
                >
                  Anterior
                </button>
                <span className="px-4 py-2 text-sm text-gray-600">
                  {page} / {data.totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                  disabled={page === data.totalPages}
                  className="px-4 py-2 rounded-lg border text-sm disabled:opacity-40"
                >
                  Siguiente
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
}
