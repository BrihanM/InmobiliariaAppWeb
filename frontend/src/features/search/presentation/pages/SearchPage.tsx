import { MainLayout } from '@/shared/components/layouts/MainLayout';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { useProperties } from '@/features/properties/hooks/useProperties';
import { PropertyCard } from '@/features/properties/components/PropertyCard';
import type { Property } from '@/features/properties/types';
import { Spinner } from '@/shared/components/ui/Spinner';
import { Input } from '@/shared/components/ui/Input';
import { useState } from 'react';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 400);

  const { data, isLoading } = useProperties({ city: debouncedQuery || undefined });

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Buscar propiedades</h1>
        <div className="max-w-lg mb-8">
          <Input
            placeholder="Buscar por ciudad…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {isLoading && (
          <div className="flex justify-center py-20">
            <Spinner size="lg" />
          </div>
        )}

        {data && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.data.map((p: Property) => (
              <PropertyCard key={p.id} property={p} />
            ))}
            {data.data.length === 0 && (
              <p className="col-span-full text-center text-gray-500 py-16">
                No se encontraron propiedades
              </p>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
