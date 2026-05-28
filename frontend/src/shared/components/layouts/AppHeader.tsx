import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useSession } from '@/features/auth/hooks/useSession';
import { useLogout } from '@/features/auth/hooks/useLogout';
import { env } from '@/core/config/env';
import type { UserRole } from '@/features/auth/types';

interface NavItem {
  label: string;
  to: string;
  end?: boolean;
}

const NAV_GUEST: NavItem[] = [
  { label: 'Inicio', to: '/', end: true },
  { label: 'Propiedades', to: '/properties' },
  { label: 'Buscar', to: '/search' },
];

const NAV_BY_ROLE: Record<UserRole, NavItem[]> = {
  CLIENT: [
    { label: 'Propiedades', to: '/properties' },
    { label: 'Buscar', to: '/search' },
    { label: 'Mis pagos', to: '/payment/history' },
  ],
  AGENT: [
    { label: 'Dashboard', to: '/dashboard', end: true },
    { label: 'Propiedades', to: '/properties' },
  ],
  ADMIN: [
    { label: 'Dashboard', to: '/dashboard', end: true },
    { label: 'Propiedades', to: '/properties' },
    { label: 'Usuarios', to: '/dashboard/users' },
  ],
};

const ROLE_LABELS: Record<UserRole, string> = {
  ADMIN: 'Administrador',
  AGENT: 'Agente',
  CLIENT: 'Cliente',
};

const ROLE_COLORS: Record<UserRole, string> = {
  ADMIN: 'bg-indigo-100 text-indigo-700',
  AGENT: 'bg-amber-100 text-amber-700',
  CLIENT: 'bg-emerald-100 text-emerald-700',
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0] ?? '')
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export interface AppHeaderProps {
  /** When true, header starts transparent and turns white on scroll (landing page mode) */
  transparent?: boolean;
}

export function AppHeader({ transparent = false }: AppHeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { user, isAuthenticated, isAdmin, isAgent, role } = useSession();
  const { logout, isLoading: isLoggingOut } = useLogout();
  const navigate = useNavigate();

  // Scroll detection for transparent mode
  useEffect(() => {
    if (!transparent) return;
    const onScroll = () => setScrolled(window.scrollY > 64);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [transparent]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const isTransparent = transparent && !scrolled;
  const navItems = isAuthenticated && role ? (NAV_BY_ROLE[role] ?? NAV_GUEST) : NAV_GUEST;
  const logoHref = isAdmin || isAgent ? '/dashboard' : '/';

  const textClass = isTransparent ? 'text-white' : 'text-slate-800';
  const mutedTextClass = isTransparent ? 'text-white/70' : 'text-slate-400';
  const navActiveClass = isTransparent ? 'text-white' : 'text-indigo-600';
  const navInactiveClass = isTransparent
    ? 'text-white/80 hover:text-white'
    : 'text-slate-600 hover:text-indigo-600';
  const iconBtnClass = isTransparent
    ? 'text-white hover:bg-white/10'
    : 'text-slate-600 hover:bg-slate-100';

  const dropdownBtn = (onClick: () => void, icon: string, label: string, danger = false) => (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left ${
        danger
          ? 'text-red-600 hover:bg-red-50'
          : 'text-slate-700 hover:bg-slate-50'
      }`}
    >
      <span className="text-base">{icon}</span>
      {label}
    </button>
  );

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        isTransparent ? 'bg-transparent' : 'bg-white shadow-sm border-b border-slate-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo ── */}
          <Link to={logoHref} className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
            </div>
            <span className={`font-bold text-lg transition-colors ${textClass}`}>
              {env.appName}
            </span>
          </Link>

          {/* ── Desktop nav ── */}
          <nav className="hidden md:flex items-center gap-7">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${isActive ? navActiveClass : navInactiveClass}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* ── Right side ── */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && user ? (
              /* ── User dropdown ── */
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((v) => !v)}
                  className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-2xl hover:bg-white/10 transition-colors"
                  aria-expanded={dropdownOpen}
                >
                  {/* Avatar */}
                  <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0 ring-2 ring-white/20">
                    {getInitials(user.name)}
                  </div>
                  <div className="text-left">
                    <p className={`text-sm font-semibold leading-none ${textClass}`}>
                      {user.name.split(' ')[0]}
                    </p>
                    {role && (
                      <p className={`text-[11px] leading-none mt-0.5 ${mutedTextClass}`}>
                        {ROLE_LABELS[role]}
                      </p>
                    )}
                  </div>
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''} ${mutedTextClass}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden"
                    >
                      {/* Header */}
                      <div className="px-4 py-3 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                            {getInitials(user.name)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-800 truncate">{user.name}</p>
                            <p className="text-xs text-slate-400 truncate">{user.email}</p>
                            {role && (
                              <span className={`inline-block mt-1 text-xs font-semibold px-2 py-0.5 rounded-full ${ROLE_COLORS[role]}`}>
                                {ROLE_LABELS[role]}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="py-1">
                        {dropdownBtn(() => { navigate('/profile'); setDropdownOpen(false); }, '👤', 'Mi perfil')}
                        {role === 'CLIENT' &&
                          dropdownBtn(() => { navigate('/payment/history'); setDropdownOpen(false); }, '💳', 'Mis pagos')}
                        {(isAdmin || isAgent) &&
                          dropdownBtn(() => { navigate('/dashboard'); setDropdownOpen(false); }, '📊', 'Dashboard')}
                      </div>

                      <div className="border-t border-slate-100 py-1">
                        {dropdownBtn(
                          () => { logout(); setDropdownOpen(false); },
                          isLoggingOut ? '⏳' : '🚪',
                          isLoggingOut ? 'Cerrando sesión...' : 'Cerrar sesión',
                          true,
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* ── Guest buttons ── */
              <>
                <Link
                  to="/login"
                  className={`text-sm font-medium transition-colors ${navInactiveClass}`}
                >
                  Iniciar sesión
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>

          {/* ── Mobile hamburger ── */}
          <button
            className={`md:hidden p-2 rounded-lg transition-colors ${iconBtnClass}`}
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label="Abrir menú"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="md:hidden bg-white border-t border-slate-100 shadow-lg overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="px-4 py-4 space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      isActive ? 'bg-indigo-50 text-indigo-600' : 'text-slate-700 hover:bg-slate-50'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}

              <div className="border-t border-slate-100 pt-3 mt-3 space-y-1">
                {isAuthenticated && user ? (
                  <>
                    <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl mb-2">
                      <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {getInitials(user.name)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-800 truncate">{user.name}</p>
                        {role && (
                          <p className="text-xs text-slate-400">{ROLE_LABELS[role]}</p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => { navigate('/profile'); setMobileMenuOpen(false); }}
                      className="w-full text-left block px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 rounded-xl"
                    >
                      👤 Mi perfil
                    </button>
                    {role === 'CLIENT' && (
                      <button
                        onClick={() => { navigate('/payment/history'); setMobileMenuOpen(false); }}
                        className="w-full text-left block px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 rounded-xl"
                      >
                        💳 Mis pagos
                      </button>
                    )}
                    <button
                      onClick={() => { logout(); setMobileMenuOpen(false); }}
                      disabled={isLoggingOut}
                      className="w-full text-left block px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-xl disabled:opacity-50"
                    >
                      🚪 Cerrar sesión
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-4 py-3 text-slate-700 text-sm font-medium text-center hover:bg-slate-50 rounded-xl"
                    >
                      Iniciar sesión
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-4 py-3 bg-indigo-600 text-white text-sm font-semibold rounded-xl text-center"
                    >
                      Registrarse
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
