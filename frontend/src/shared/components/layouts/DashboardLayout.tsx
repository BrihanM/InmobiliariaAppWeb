import type { ReactNode } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSession } from '@/features/auth/hooks/useSession';
import { useLogout } from '@/features/auth/hooks/useLogout';
import { env } from '@/core/config/env';

interface DashboardLayoutProps {
  children: ReactNode;
}

interface NavItem {
  to: string;
  label: string;
  icon: string;
  end?: boolean;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, isAdmin } = useSession();
  const { logout, isLoading: isLoggingOut } = useLogout();
  const navigate = useNavigate();

  const navLinks: NavItem[] = [
    { to: '/dashboard', label: 'Resumen', icon: '📊', end: true },
    { to: '/properties', label: 'Propiedades', icon: '🏠' },
    ...(isAdmin ? [{ to: '/dashboard/users', label: 'Usuarios', icon: '👥' }] : []),
    { to: '/payment/history', label: 'Pagos', icon: '💳' },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r border-gray-100 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
          <Link to="/" className="text-lg font-bold text-indigo-600">
            {env.appName}
          </Link>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <span>{link.icon}</span>
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* User footer */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={() => navigate('/profile')}
            className="w-full text-left mb-2 hover:bg-gray-50 rounded-xl px-2 py-1.5 transition-colors"
          >
            <p className="text-sm font-medium text-gray-800 truncate">{user?.name}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </button>
          <button
            onClick={logout}
            disabled={isLoggingOut}
            className="text-xs text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto px-6 py-8">{children}</div>
      </main>
    </div>
  );
}
