import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLatestProperties } from '../hooks/useLatestProperties';
import { PropertyCard } from './PropertyCard';
import { PropertyCardSkeleton } from './skeletons/PropertyCardSkeleton';

export function LatestProperties() {
  const { data, isLoading, isError, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useLatestProperties();

  const properties = data?.pages.flatMap((page) => page.data) ?? [];
  const total = data?.pages[0]?.total ?? 0;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12 gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <span className="text-indigo-600 text-sm font-semibold uppercase tracking-wider">
              Recién publicadas
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 mt-2">
              Últimas propiedades
            </h2>
            <p className="text-slate-500 mt-3">
              {total > 0 ? `${total.toLocaleString('es')} propiedades disponibles` : 'Las más recientes en nuestra plataforma'}
            </p>
          </div>
          <Link
            to="/search"
            className="inline-flex items-center gap-2 text-indigo-600 font-semibold hover:text-indigo-700 shrink-0 group"
          >
            Búsqueda avanzada
            <svg
              className="w-4 h-4 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </motion.div>

        {/* Error state */}
        {isError && (
          <div className="text-center py-16">
            <p className="text-slate-500">No se pudieron cargar las propiedades.</p>
          </div>
        )}

        {/* Loading skeletons */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <PropertyCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Grid */}
        {!isLoading && !isError && (
          <>
            {properties.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-slate-400 text-lg">No hay propiedades disponibles.</p>
              </div>
            ) : (
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                {properties.map((property, i) => (
                  <motion.div
                    key={property.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: Math.min(i % 8, 3) * 0.08, duration: 0.4 }}
                  >
                    <PropertyCard property={property} />
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Inline skeletons for next page */}
            {isFetchingNextPage && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-5">
                {Array.from({ length: 4 }).map((_, i) => (
                  <PropertyCardSkeleton key={i} />
                ))}
              </div>
            )}

            {/* Load more */}
            {hasNextPage && !isFetchingNextPage && (
              <div className="flex justify-center mt-12">
                <button
                  onClick={() => { void fetchNextPage(); }}
                  className="px-10 py-4 border-2 border-indigo-600 text-indigo-600 font-semibold rounded-2xl hover:bg-indigo-600 hover:text-white transition-all duration-200 flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Cargar más propiedades
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
