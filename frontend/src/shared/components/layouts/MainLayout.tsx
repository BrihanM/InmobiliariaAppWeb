import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useSession } from '@/features/auth/hooks/useSession';
import { useLogout } from '@/features/auth/hooks/useLogout';
import { Button } from '@/shared/components/ui/Button';
import { env } from '@/core/config/env';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { user, isAuthenticated, isAdmin, isAgent } = useSession();
  const { logout, isLoading: isLoggingOut } = useLogout();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navbar */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-blue-600">
            {env.appName}
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600">
            <Link to="/properties" className="hover:text-blue-600 transition-colors">
              Propiedades
            </Link>
            <Link to="/search" className="hover:text-blue-600 transition-colors">
              Buscar
            </Link>
            {(isAdmin || isAgent) && (
              <Link to="/dashboard" className="hover:text-blue-600 transition-colors">
                Dashboard
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <span className="hidden sm:block text-sm text-gray-600">{user?.name}</span>
                <Button variant="ghost" size="sm" onClick={logout} disabled={isLoggingOut}>
                  Salir
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Iniciar sesión
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Registrarse</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-6 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} {env.appName}. Todos los derechos reservados.
      </footer>
    </div>
  );
}

