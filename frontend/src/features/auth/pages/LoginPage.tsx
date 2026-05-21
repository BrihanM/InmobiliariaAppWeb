import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LoginForm } from '../components/LoginForm';
import { env } from '@/core/config/env';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1400&q=80&auto=format&fit=crop';

const STATS = [
  { value: '20+', label: 'Propiedades' },
  { value: '3', label: 'Roles de acceso' },
  { value: '100%', label: 'Digital' },
];

export default function LoginPage() {
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
            Bienvenido<br />de vuelta
          </h1>
          <p className="text-sm text-slate-500 mb-8">
            Inicia sesión para gestionar tus propiedades
          </p>

          <LoginForm />

          <p className="mt-6 text-center text-sm text-slate-500">
            ¿No tienes cuenta?{' '}
            <Link
              to="/register"
              className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
            >
              Regístrate gratis
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
        {/* Imagen de fondo */}
        <img
          src={HERO_IMAGE}
          alt="Apartamentos modernos en Colombia"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* Gradiente oscuro sobre la imagen */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/80 via-slate-900/65 to-slate-900/90" />

        {/* Patrón de puntos decorativo */}
        <div
          className="absolute top-0 right-0 w-64 h-64 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />

        {/* Contenido sobre la imagen */}
        <div className="relative z-10 flex flex-col justify-end h-full px-16 pb-14 pt-20 text-white">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-xs font-medium text-white/80 mb-6 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Plataforma activa · Colombia
          </div>

          {/* Cita */}
          <blockquote className="mb-10">
            <p className="text-2xl font-semibold leading-snug text-white/90 max-w-sm">
              "Centraliza la gestión de ventas, alquileres y administración de inmuebles en un solo lugar."
            </p>
          </blockquote>

          {/* Stats */}
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
