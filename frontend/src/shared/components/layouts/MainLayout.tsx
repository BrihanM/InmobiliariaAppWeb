import type { ReactNode } from 'react';
import { AppHeader } from './AppHeader';
import { env } from '@/core/config/env';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <AppHeader />

      {/* Content — pt-16 to clear fixed header */}
      <main className="flex-1 pt-16">{children}</main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-6 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} {env.appName}. Todos los derechos reservados.
      </footer>
    </div>
  );
}
