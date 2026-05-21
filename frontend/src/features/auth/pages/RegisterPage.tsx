import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RegisterForm } from '../components/RegisterForm';
import { env } from '@/core/config/env';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400&q=80&auto=format&fit=crop';

const STATS = [
  { value: '20+', label: 'Propiedades' },
  { value: '6', label: 'Ciudades' },
  { value: '100%', label: 'Verificadas' },
];

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex bg-slate-900">

      {/* ── LEFT — formulario ── */}
      <motion.div
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="relative z-10 w-full lg:w-1/2 flex items-center justify-center bg-white px-8 py-14"
      >
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <svg width="22" height="22" fill="white" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
            </div>
            <div>
              <p className="font-extrabold text-slate-900 leading-none">{env.appName}</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest">HomeLive Inmuebles</p>
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-3xl font-extrabold text-slate-900 leading-tight mb-1">
            Crea tu<br />cuenta gratis
          </h1>
          <p className="text-sm text-slate-500 mb-8">
            Únete y encuentra tu próximo inmueble en Colombia
          </p>

          <RegisterForm />

          <p className="mt-6 text-center text-sm text-slate-500">
            ¿Ya tienes cuenta?{' '}
            <Link
              to="/login"
              className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
            >
              Inicia sesión
            </Link>
          </p>
        </div>
      </motion.div>

      {/* ── RIGHT — imagen con corte diagonal ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="hidden lg:block relative w-1/2 overflow-hidden"
        style={{ clipPath: 'polygon(7% 0, 100% 0, 100% 100%, 0% 100%)' }}
      >
        <img
          src={HERO_IMAGE}
          alt="Casa moderna en Colombia"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/80 via-slate-900/65 to-slate-900/90" />

        <div
          className="absolute top-0 right-0 w-64 h-64 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />

        <div className="relative z-10 flex flex-col justify-end h-full px-16 pb-14 pt-20 text-white">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-xs font-medium text-white/80 mb-6 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Regístrate gratis · Sin tarjeta requerida
          </div>

          <blockquote className="mb-10">
            <p className="text-2xl font-semibold leading-snug text-white/90 max-w-sm">
              "Accede a propiedades verificadas en las mejores ciudades de Colombia."
            </p>
          </blockquote>

          <div className="flex gap-4 mb-10">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-4 border border-white/15 flex-1"
              >
                <p className="text-2xl font-extrabold text-white">{stat.value}</p>
                <p className="text-xs text-white/60 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>

          <p className="text-white/30 text-xs">
            © {new Date().getFullYear()} HomeLive Inmuebles · Colombia
          </p>
        </div>
      </motion.div>
    </div>
  );
}
