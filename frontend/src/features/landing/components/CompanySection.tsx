import { motion } from 'framer-motion';

const STATS = [
  { value: '15+', label: 'Años de experiencia' },
  { value: '5,000+', label: 'Propiedades vendidas' },
  { value: '98%', label: 'Clientes satisfechos' },
];

const FEATURES = [
  'Agentes certificados y con experiencia comprobada',
  'Proceso de compra 100% transparente y seguro',
  'Asesoría legal y financiera sin costo adicional',
  'Tecnología de punta para tu comodidad',
];

const COMPANY_IMAGE =
  'https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=900&q=75&auto=format&fit=crop';

export function CompanySection() {
  return (
    <section id="nosotros" className="py-20 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image side */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3]">
              <img
                src={COMPANY_IMAGE}
                alt="Equipo inmobiliario"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 to-transparent" />
            </div>
            {/* Floating card */}
            <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-5 flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-2xl">
                🏆
              </div>
              <div>
                <p className="font-bold text-slate-800">Premio Excelencia</p>
                <p className="text-slate-500 text-sm">Mejor plataforma 2024</p>
              </div>
            </div>
            {/* Corner dot decoration */}
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-indigo-100 rounded-2xl -z-10" />
          </motion.div>

          {/* Text side */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="text-indigo-600 text-sm font-semibold uppercase tracking-wider">
              Quiénes somos
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 mt-2 mb-4">
              Conectamos personas
              <span className="block text-indigo-600">con sus hogares ideales</span>
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-8">
              Somos la plataforma inmobiliaria de mayor confianza en Colombia. Desde 2019
              hemos ayudado a miles de familias y empresas a encontrar el espacio perfecto para
              vivir y crecer en territorio colombiano.
            </p>

            {/* Features */}
            <ul className="space-y-3 mb-10">
              {FEATURES.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <span className="w-5 h-5 bg-indigo-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                  <span className="text-slate-600">{feature}</span>
                </li>
              ))}
            </ul>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-200">
              {STATS.map((stat) => (
                <div key={stat.label}>
                  <p className="text-3xl font-extrabold text-indigo-600">{stat.value}</p>
                  <p className="text-slate-500 text-sm mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
