import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { Category } from '../types';

const CATEGORIES: Category[] = [
  {
    type: 'house',
    label: 'Casas',
    icon: '🏠',
    description: 'Encuentra la casa de tus sueños',
    color: 'from-amber-50 to-orange-50 border-amber-100 hover:border-amber-300',
  },
  {
    type: 'apartment',
    label: 'Apartamentos',
    icon: '🏢',
    description: 'Vida moderna en la ciudad',
    color: 'from-blue-50 to-indigo-50 border-blue-100 hover:border-blue-300',
  },
  {
    type: 'land',
    label: 'Terrenos',
    icon: '🌿',
    description: 'Construye tu espacio ideal',
    color: 'from-emerald-50 to-green-50 border-emerald-100 hover:border-emerald-300',
  },
  {
    type: 'commercial',
    label: 'Comercial',
    icon: '🏪',
    description: 'Espacios para tu negocio',
    color: 'from-purple-50 to-violet-50 border-purple-100 hover:border-purple-300',
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
};

export function CategorySection() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-indigo-600 text-sm font-semibold uppercase tracking-wider">
            Categorías
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 mt-2">
            Explora por categoría
          </h2>
          <p className="text-slate-500 mt-3 max-w-xl mx-auto">
            Filtra según el tipo de propiedad que mejor se adapta a lo que estás buscando.
          </p>
        </motion.div>

        {/* Categories grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {CATEGORIES.map((cat) => (
            <motion.div key={cat.type} variants={itemVariants}>
              <Link
                to={`/properties?type=${cat.type}`}
                className={`group block p-6 rounded-2xl border-2 bg-gradient-to-br ${cat.color} transition-all duration-200 hover:-translate-y-1 hover:shadow-lg`}
              >
                <div className="text-4xl mb-4">{cat.icon}</div>
                <h3 className="font-bold text-slate-800 text-xl mb-1 group-hover:text-indigo-600 transition-colors">
                  {cat.label}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">{cat.description}</p>
                <div className="mt-4 flex items-center gap-1 text-indigo-600 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                  Explorar
                  <svg className="w-4 h-4 translate-x-0 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
