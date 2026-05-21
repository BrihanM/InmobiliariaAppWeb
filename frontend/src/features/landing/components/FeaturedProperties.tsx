import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useFeaturedProperties } from '../hooks/useFeaturedProperties';
import { PropertyCard } from './PropertyCard';
import { PropertyCardSkeleton } from './skeletons/PropertyCardSkeleton';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function FeaturedProperties() {
  const { data, isLoading, isError } = useFeaturedProperties();
  const properties = data?.data ?? [];

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
              Selección premium
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 mt-2">
              Propiedades destacadas
            </h2>
            <p className="text-slate-500 mt-3 max-w-lg">
              Descubre nuestra selección de propiedades más exclusivas, elegidas por nuestros
              expertos.
            </p>
          </div>
          <Link
            to="/properties"
            className="inline-flex items-center gap-2 text-indigo-600 font-semibold hover:text-indigo-700 shrink-0 group"
          >
            Ver todas
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

        {/* Grid */}
        {isError ? (
          <div className="text-center py-16">
            <p className="text-slate-500">No se pudieron cargar las propiedades.</p>
            <Link to="/properties" className="mt-4 text-indigo-600 hover:underline text-sm inline-block">
              Ver listado completo
            </Link>
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <PropertyCardSkeleton key={i} />
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-slate-400 text-lg">Aún no hay propiedades disponibles.</p>
            <Link
              to="/properties"
              className="mt-4 inline-block px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
            >
              Explorar propiedades
            </Link>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            {properties.map((property) => (
              <motion.div key={property.id} variants={cardVariants}>
                <PropertyCard property={property} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Bottom CTA */}
        {!isLoading && properties.length > 0 && (
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Link
              to="/properties"
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-indigo-600 text-indigo-600 font-semibold rounded-2xl hover:bg-indigo-600 hover:text-white transition-all duration-200"
            >
              Ver todas las propiedades
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}
