import { useState, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useSession } from '@/features/auth/hooks/useSession';
import { useProperties } from '../hooks/useProperties';
import { useDeleteProperty } from '../hooks/useDeleteProperty';
import { PropertyCard } from '../components/PropertyCard';
import { PropertyCardSkeleton } from '../components/skeletons/PropertyCardSkeleton';
import { PropertyTable } from '../components/PropertyTable';
import { PropertyTableSkeleton } from '../components/skeletons/PropertyTableSkeleton';
import { PropertyFilters } from '../components/PropertyFilters';
import { PropertyModal } from '../components/PropertyModal';
import { MainLayout } from '@/shared/components/layouts/MainLayout';
import type { Property, PropertyFilters as ApiFilters } from '../types';
import type { FilterValues } from '../components/PropertyFilters';
import { useNavigate } from 'react-router-dom';

const SKELETONS = 12;

function buildApiFilters(f: FilterValues): ApiFilters {
  const filters: ApiFilters = {};
  if (f.type) filters.type = f.type as ApiFilters['type'];
  if (f.status) filters.status = f.status as ApiFilters['status'];
  if (f.city) filters.city = f.city;
  if (f.minPrice) filters.minPrice = Number(f.minPrice);
  if (f.maxPrice) filters.maxPrice = Number(f.maxPrice);
  return filters;
}

export default function PropertiesPage() {
  const { user } = useSession();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const isAdminOrAgent = user?.role === 'ADMIN' || user?.role === 'AGENT';

  const filterValues: FilterValues = {
    type: searchParams.get('type') ?? '',
    status: searchParams.get('status') ?? '',
    city: searchParams.get('city') ?? '',
    minPrice: searchParams.get('minPrice') ?? '',
    maxPrice: searchParams.get('maxPrice') ?? '',
  };

  const handleFilterChange = useCallback((key: keyof FilterValues, value: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) next.set(key, value);
      else next.delete(key);
      return next;
    });
  }, [setSearchParams]);

  const handleReset = useCallback(() => {
    setSearchParams({});
  }, [setSearchParams]);

  const apiFilters = buildApiFilters(filterValues);
  const { data, isLoading, isError } = useProperties(apiFilters);
  const deleteProperty = useDeleteProperty();

  const properties: Property[] = data?.data ?? [];

  const handleView = (property: Property) => {
    setSelectedProperty(property);
    setModalOpen(true);
  };

  const handleEdit = (property: Property) => {
    navigate(`/properties/${property.id}/edit`);
  };

  const handleDelete = (property: Property) => {
    deleteProperty.mutate(property.id);
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Propiedades</h1>
              <p className="text-slate-500 text-sm mt-1">
                {isLoading ? 'Cargando...' : `${data?.total ?? properties.length} propiedades disponibles`}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* View toggle (admin only) */}
              {user?.role === 'ADMIN' && (
                <div className="flex bg-white border border-slate-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-3 py-2 text-sm font-medium transition-colors ${viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-700'}`}
                    aria-label="Vista cuadrícula"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode('table')}
                    className={`px-3 py-2 text-sm font-medium transition-colors ${viewMode === 'table' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-700'}`}
                    aria-label="Vista tabla"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              )}

              {/* New property button */}
              {isAdminOrAgent && (
                <Link
                  to="/properties/create"
                  className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Nueva propiedad
                </Link>
              )}
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar filters */}
            <aside className="w-full lg:w-72 shrink-0">
              <div className="sticky top-20">
                <PropertyFilters
                  values={filterValues}
                  onChange={handleFilterChange}
                  onReset={handleReset}
                  resultCount={isLoading ? undefined : properties.length}
                />
              </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 min-w-0">
              {/* Error state */}
              {isError && (
                <div className="text-center py-16">
                  <p className="text-slate-500 text-sm">Error al cargar las propiedades. Intenta de nuevo.</p>
                </div>
              )}

              {/* Grid view */}
              {!isError && viewMode === 'grid' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {isLoading
                    ? Array.from({ length: SKELETONS }).map((_, i) => <PropertyCardSkeleton key={i} />)
                    : properties.map((property) => (
                        <PropertyCard
                          key={property.id}
                          property={property}
                          onQuickView={handleView}
                          onEdit={isAdminOrAgent ? handleEdit : undefined}
                          onDelete={user?.role === 'ADMIN' ? handleDelete : undefined}
                        />
                      ))}

                  {!isLoading && properties.length === 0 && (
                    <div className="col-span-full py-20 text-center">
                      <p className="text-slate-400 text-sm">No se encontraron propiedades con los filtros actuales.</p>
                      <button onClick={handleReset} className="text-indigo-600 text-sm mt-2 hover:underline">
                        Limpiar filtros
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Table view */}
              {!isError && viewMode === 'table' && (
                isLoading
                  ? <PropertyTableSkeleton />
                  : <PropertyTable
                      properties={properties}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onView={handleView}
                    />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick view modal */}
      <PropertyModal
        property={selectedProperty}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onEdit={isAdminOrAgent ? handleEdit : undefined}
      />
    </MainLayout>
  );
}
