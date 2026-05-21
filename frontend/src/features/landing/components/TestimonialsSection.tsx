import { motion } from 'framer-motion';
import type { Testimonial } from '../types';

const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'María González',
    role: 'Compradora, Bogotá',
    content:
      'Encontré el apartamento perfecto en menos de 2 semanas. El proceso fue completamente transparente y el agente nos guió en cada paso. ¡100% recomendado!',
    rating: 5,
    initials: 'MG',
    avatarColor: 'bg-indigo-500',
  },
  {
    id: '2',
    name: 'Carlos Mendoza',
    role: 'Inversionista, Medellín',
    content:
      'Llevo 3 años usando la plataforma para gestionar mis propiedades de inversión. La herramienta es intuitiva y el equipo de soporte siempre responde rápido.',
    rating: 5,
    initials: 'CM',
    avatarColor: 'bg-emerald-500',
  },
  {
    id: '3',
    name: 'Ana Rodríguez',
    role: 'Arrendataria, Bogotá',
    content:
      'La búsqueda avanzada me permitió filtrar exactamente lo que necesitaba. Encontré mi oficina ideal para mi startup en tiempo récord.',
    rating: 5,
    initials: 'AR',
    avatarColor: 'bg-violet-500',
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} de 5 estrellas`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i < rating ? 'text-amber-400' : 'text-slate-200'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function TestimonialsSection() {
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
            Testimonios
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 mt-2">
            Lo que dicen nuestros clientes
          </h2>
          <p className="text-slate-500 mt-3 max-w-xl mx-auto">
            Miles de familias e inversionistas ya encontraron lo que buscaban. Esto es lo que
            opinan de nosotros.
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {TESTIMONIALS.map((t) => (
            <motion.div key={t.id} variants={cardVariants}>
              <div className="bg-white rounded-2xl p-6 shadow-md h-full flex flex-col">
                <StarRating rating={t.rating} />
                <blockquote className="mt-4 text-slate-600 leading-relaxed flex-1">
                  &ldquo;{t.content}&rdquo;
                </blockquote>
                <div className="flex items-center gap-3 mt-6 pt-5 border-t border-slate-100">
                  <div
                    className={`w-10 h-10 ${t.avatarColor} rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0`}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">{t.name}</p>
                    <p className="text-slate-400 text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Trust bar */}
        <motion.div
          className="mt-16 flex flex-wrap justify-center items-center gap-8 opacity-40"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.4 }}
          viewport={{ once: true }}
        >
          {['Google', 'Forbes', 'El País', 'Expansión', 'Bloomberg'].map((brand) => (
            <span key={brand} className="text-slate-600 font-bold text-lg tracking-wide">
              {brand}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
