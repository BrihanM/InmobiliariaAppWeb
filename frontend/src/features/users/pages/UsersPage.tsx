import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/shared/components/layouts/DashboardLayout';
import { Button } from '@/shared/components/ui/Button';
import { usePagination } from '@/shared/hooks/usePagination';
import { useUsers } from '../hooks/useUsers';
import { UsersTable } from '../components/UsersTable';
import { UserFiltersBar } from '../components/UserFilters';
import { UsersTableSkeleton } from '../components/skeletons/UsersTableSkeleton';
import { EditUserModal, RoleModal, DeleteUserModal } from '../components/UserModal';
import { useSession } from '@/features/auth/hooks/useSession';
import type { UserFilters } from '../types';

const PAGE_SIZE = 10;

export default function UsersPage() {
  const navigate = useNavigate();
  const { isAdmin } = useSession();
  const { page, goToPage, reset } = usePagination(1, PAGE_SIZE);
  const [filters, setFilters] = useState<UserFilters>({});

  const activeFilters: UserFilters = { ...filters, page, pageSize: PAGE_SIZE };
  const { data, isLoading, isError, isFetching } = useUsers(activeFilters);

  function handleFiltersChange(next: UserFilters) {
    setFilters(next);
    if (next.page) goToPage(next.page);
    else reset();
  }

  function handleFiltersReset() {
    setFilters({});
    reset();
  }

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Usuarios</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              Gestiona los usuarios de la plataforma
            </p>
          </div>
          {isAdmin && (
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate('/dashboard/users/new-agent')}
              >
                ➕ Nuevo agente
              </Button>
            </div>
          )}
        </div>

        {/* Stats row */}
        {data && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Total', value: data.total, icon: '👥', color: 'text-indigo-600' },
              {
                label: 'Admins',
                value: data.data.filter((u) => u.role === 'ADMIN').length,
                icon: '⚡',
                color: 'text-violet-600',
              },
              {
                label: 'Agentes',
                value: data.data.filter((u) => u.role === 'AGENT').length,
                icon: '🏠',
                color: 'text-amber-600',
              },
              {
                label: 'Clientes',
                value: data.data.filter((u) => u.role === 'CLIENT').length,
                icon: '👤',
                color: 'text-emerald-600',
              },
            ].map((stat) => (
              <div key={stat.label} className="bg-white border border-gray-100 rounded-2xl px-4 py-3 flex items-center gap-3">
                <span className="text-2xl">{stat.icon}</span>
                <div>
                  <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                  <p className="text-xs text-gray-400">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Filters */}
        <div className="bg-white border border-gray-100 rounded-2xl px-5 py-4 shadow-sm">
          <UserFiltersBar
            filters={filters}
            onChange={handleFiltersChange}
            onReset={handleFiltersReset}
          />
        </div>

        {/* Table */}
        <div className={isFetching && !isLoading ? 'opacity-70 transition-opacity' : ''}>
          {isLoading ? (
            <UsersTableSkeleton />
          ) : isError ? (
            <div className="rounded-2xl border border-red-100 bg-red-50 p-10 text-center">
              <p className="text-4xl mb-2">⚠️</p>
              <p className="text-sm text-red-600 font-medium">Error al cargar usuarios</p>
              <p className="text-xs text-red-400 mt-1">Verifica tu conexión o permisos de administrador</p>
            </div>
          ) : (
            <UsersTable
              users={data?.data ?? []}
              total={data?.total ?? 0}
              page={page}
              pageSize={PAGE_SIZE}
              onPageChange={goToPage}
            />
          )}
        </div>
      </motion.div>

      {/* Modals */}
      <EditUserModal />
      <RoleModal />
      <DeleteUserModal />
    </DashboardLayout>
  );
}
