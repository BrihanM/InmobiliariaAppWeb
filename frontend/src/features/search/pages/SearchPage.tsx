import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { MainLayout } from '@/shared/components/layouts/MainLayout';
import { SearchBar } from '../components/SearchBar';
import { SearchFiltersPanel } from '../components/SearchFiltersPanel';
import { SearchResultCard } from '../components/SearchResultCard';
import { SearchResultSkeleton } from '../components/SearchResultSkeleton';
import { SearchResultsHeader } from '../components/SearchResultsHeader';
import { useSearch } from '../hooks/useSearch';
import { TYPE_FILTER_OPTIONS, DEFAULT_LIMIT } from '../types';
import type { SortOption } from '../types';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [view, setView] = useState<'grid' | 'list'>('grid');

  // Local state for the input — allows responsive typing before debounce kicks in
  const [inputValue, setInputValue] = useState(searchParams.get('q') ?? '');
  const debouncedQuery = useDebounce(inputValue, 500);

  // Sync debounced query → URL (replace so back button works cleanly)
  useEffect(() => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (debouncedQuery) next.set('q', debouncedQuery);
        else next.delete('q');
        next.delete('page');
        return next;
      },
      { replace: true },
    );
  }, [debouncedQuery, setSearchParams]);

  // Generic URL param updater — resets page for filter changes
  const updateParam = useCallback(
    (key: string, value: string) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (value) next.set(key, value);
          else next.delete(key);
          if (key !== 'page') next.delete('page');
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const resetFilters = useCallback(() => {
    const next = new URLSearchParams();
    if (debouncedQuery) next.set('q', debouncedQuery);
    setSearchParams(next, { replace: true });
  }, [debouncedQuery, setSearchParams]);

  // Derive API params from URL
  const currentPage = Number(searchParams.get('page') ?? '1');
  const currentSort = (searchParams.get('sort') ?? 'newest') as SortOption;

  const apiParams = {
    q: searchParams.get('q') || undefined,
    type: searchParams.get('type') || undefined,
    status: searchParams.get('status') || undefined,
    city: searchParams.get('city') || undefined,
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    sort: currentSort,
    page: currentPage,
  };

  const { data, isLoading, isFetching } = useSearch(apiParams);
  const properties = data?.data ?? [];
  const totalPages = data?.totalPages ?? 0;

  // Current filter values for UI (all from URL)
  const filterValues = {
    type: searchParams.get('type') ?? '',
    status: searchParams.get('status') ?? '',
    city: searchParams.get('city') ?? '',
    minPrice: searchParams.get('minPrice') ?? '',
    maxPrice: searchParams.get('maxPrice') ?? '',
  };

  const activeTypeFilter = searchParams.get('type') ?? '';

  // Pagination page window
  const pageWindow = (() => {
    const total = Math.min(totalPages, 7);
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 4) return Array.from({ length: total }, (_, i) => i + 1);
    if (currentPage >= totalPages - 3)
      return Array.from({ length: total }, (_, i) => totalPages - 6 + i);
    return Array.from({ length: total }, (_, i) => currentPage - 3 + i);
  })();

  return (
    <MainLayout>
      {/* ── Hero search section ── */}
      <section className="relative bg-gradient-to-br from-slate-900 via-indigo-900 to-violet-900 py-14 px-4 overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-violet-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl mx-auto text-center">
          <h1 className="text-white text-3xl sm:text-4xl font-extrabold mb-2 tracking-tight">
            Encuentra tu hogar ideal
          </h1>
          <p className="text-indigo-300 text-sm mb-7">
            Búsqueda avanzada con filtros en tiempo real
          </p>

          <SearchBar value={inputValue} onChange={setInputValue} autoFocus={!inputValue} />

          {/* Quick type pill filters */}
          <div className="flex flex-wrap justify-center gap-2 mt-5">
            {TYPE_FILTER_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => updateParam('type', opt.value)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTypeFilter === opt.value
                    ? 'bg-white text-indigo-700 shadow-md scale-105'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <span aria-hidden="true">{opt.icon}</span>
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Results section ── */}
      <div className="bg-slate-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar filters */}
            <aside className="w-full lg:w-72 shrink-0">
              <div className="sticky top-20">
                <SearchFiltersPanel
                  type={filterValues.type}
                  status={filterValues.status}
                  city={filterValues.city}
                  minPrice={filterValues.minPrice}
                  maxPrice={filterValues.maxPrice}
                  onUpdate={updateParam}
                  onReset={resetFilters}
                />
              </div>
            </aside>

            {/* Main results area */}
            <div className="flex-1 min-w-0">
              <SearchResultsHeader
                total={data?.total}
                isLoading={isLoading}
                isFetching={isFetching}
                sort={currentSort}
                view={view}
                query={searchParams.get('q') ?? ''}
                onSortChange={(sort) => updateParam('sort', sort)}
                onViewChange={setView}
              />

              {/* Loading skeletons */}
              {isLoading && <SearchResultSkeleton view={view} count={DEFAULT_LIMIT} />}

              {/* Results */}
              {!isLoading && properties.length > 0 && (
                <div
                  className={`transition-opacity duration-200 ${isFetching ? 'opacity-60' : 'opacity-100'}`}
                >
                  {view === 'grid' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                      {properties.map((property) => (
                        <SearchResultCard key={property.id} property={property} view="grid" />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {properties.map((property) => (
                        <SearchResultCard key={property.id} property={property} view="list" />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Empty state */}
              {!isLoading && properties.length === 0 && (
                <div className="text-center py-24">
                  <div className="text-5xl mb-4" aria-hidden="true">🔍</div>
                  <h3 className="text-lg font-semibold text-slate-700 mb-2">Sin resultados</h3>
                  <p className="text-slate-400 text-sm mb-5">
                    No encontramos propiedades con los filtros seleccionados.
                    <br />
                    Prueba con otros términos o amplía tu búsqueda.
                  </p>
                  <button
                    onClick={resetFilters}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
                  >
                    Limpiar filtros
                  </button>
                </div>
              )}

              {/* Pagination */}
              {!isLoading && totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  <button
                    onClick={() => updateParam('page', String(currentPage - 1))}
                    disabled={currentPage <= 1}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium transition-colors"
                  >
                    ← Anterior
                  </button>

                  <div className="flex gap-1">
                    {pageWindow.map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => updateParam('page', String(pageNum))}
                        className={`w-9 h-9 rounded-xl text-sm font-semibold transition-colors ${
                          currentPage === pageNum
                            ? 'bg-indigo-600 text-white shadow-sm'
                            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => updateParam('page', String(currentPage + 1))}
                    disabled={currentPage >= totalPages}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium transition-colors"
                  >
                    Siguiente →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
