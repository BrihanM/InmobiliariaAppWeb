import { motion, type Variants } from 'framer-motion';
import { SearchBar } from './SearchBar';

const STATS = [
  { value: '2,500+', label: 'Propiedades activas' },
  { value: '150+', label: 'Ciudades' },
  { value: '10k+', label: 'Clientes felices' },
  { value: '98%', label: 'Satisfacción' },
];

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1920&q=75&auto=format&fit=crop';

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <img
          src={HERO_IMAGE}
          alt="Modern home"
          className="w-full h-full object-cover"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-indigo-950/75 to-slate-900/85" />
        {/* Decorative orbs */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Badge */}
        <motion.div variants={itemVariants}>
          <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-sm font-medium px-5 py-2.5 rounded-full mb-8">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            La plataforma inmobiliaria #1 en Colombia
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-white mb-6 leading-tight tracking-tight"
          variants={itemVariants}
        >
          Encuentra tu hogar
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">
            ideal hoy
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-slate-300 text-lg sm:text-xl max-w-2xl mx-auto mb-12 leading-relaxed"
          variants={itemVariants}
        >
          Miles de propiedades en venta y alquiler. Encuentra el lugar perfecto para vivir,
          invertir o emprender.
        </motion.p>

        {/* Search bar */}
        <motion.div variants={itemVariants}>
          <SearchBar />
        </motion.div>

        {/* Stats */}
        <motion.div
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10"
          variants={itemVariants}
        >
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl md:text-4xl font-extrabold text-white mb-1">{stat.value}</p>
              <p className="text-slate-400 text-sm">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
      >
        <svg className="w-6 h-6 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </motion.div>
    </section>
  );
}
