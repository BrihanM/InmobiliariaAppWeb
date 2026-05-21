import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import type { BackendUser } from '../types';
import { UserRoleBadge } from './UserRoleBadge';
import { UserStatusBadge } from './UserStatusBadge';
import { getUserFullName, getUserInitials, getUserStatus, buildAvatarColor, formatDate } from '../utils/userHelpers';
import { useUsersStore } from '../store/usersStore';
import { useSession } from '@/features/auth/hooks/useSession';

interface UsersTableProps {
  users: BackendUser[];
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

type SortKey = 'name' | 'email' | 'role' | 'createdAt';
type SortDir = 'asc' | 'desc';

const rowVariants: Variants = {
  hidden: { opacity: 0, y: 6 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.04, duration: 0.2 } }),
};

export function UsersTable({ users, total, page, pageSize, onPageChange }: UsersTableProps) {
  const navigate = useNavigate();
  const { isAdmin } = useSession();
  const { openDeleteModal, openRoleModal, openEditModal } = useUsersStore();

  const [sortKey, setSortKey] = useState<SortKey>('createdAt');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const totalPages = Math.ceil(total / pageSize);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  }

  const sorted = [...users].sort((a, b) => {
    let va = '';
    let vb = '';
    if (sortKey === 'name') { va = getUserFullName(a); vb = getUserFullName(b); }
    else if (sortKey === 'email') { va = a.email; vb = b.email; }
    else if (sortKey === 'role') { va = a.role ?? ''; vb = b.role ?? ''; }
    else { va = a.createdAt; vb = b.createdAt; }
    return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
  });

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <span className="text-gray-300 ml-1">↕</span>;
    return <span className="text-indigo-500 ml-1">{sortDir === 'asc' ? '↑' : '↓'}</span>;
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-sm">
      {/* Table header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100 bg-gray-50/60">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
          {total} usuario{total !== 1 ? 's' : ''}
        </p>
        <p className="text-xs text-gray-400">
          Pág. {page} / {totalPages || 1}
        </p>
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-[2.5rem_1fr_1fr_auto_auto_auto_auto] gap-4 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-gray-400 border-b border-gray-100 hidden md:grid">
        <div />
        <button onClick={() => handleSort('name')} className="text-left hover:text-gray-700 transition-colors">
          Nombre <SortIcon col="name" />
        </button>
        <button onClick={() => handleSort('email')} className="text-left hover:text-gray-700 transition-colors">
          Email <SortIcon col="email" />
        </button>
        <button onClick={() => handleSort('role')} className="hover:text-gray-700 transition-colors">
          Rol <SortIcon col="role" />
        </button>
        <div>Estado</div>
        <button onClick={() => handleSort('createdAt')} className="hover:text-gray-700 transition-colors">
          Registro <SortIcon col="createdAt" />
        </button>
        <div>Acciones</div>
      </div>

      {/* Rows */}
      {sorted.length === 0 ? (
        <div className="py-16 text-center text-gray-400">
          <p className="text-4xl mb-2">👥</p>
          <p className="text-sm">No se encontraron usuarios</p>
        </div>
      ) : (
        <AnimatePresence>
          {sorted.map((user, i) => {
            const status = getUserStatus(user);
            const initials = getUserInitials(user);
            const avatarBg = buildAvatarColor(user.id);

            return (
              <motion.div
                key={user.id}
                custom={i}
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-[2.5rem_1fr] md:grid-cols-[2.5rem_1fr_1fr_auto_auto_auto_auto] gap-4 items-center px-6 py-3.5 border-b border-gray-50 last:border-0 hover:bg-gray-50/70 transition-colors group"
              >
                {/* Avatar */}
                <div
                  className={`h-9 w-9 rounded-full ${avatarBg} flex items-center justify-center text-white text-xs font-bold shrink-0`}
                >
                  {initials}
                </div>

                {/* Name */}
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{getUserFullName(user)}</p>
                  <p className="text-xs text-gray-400 truncate md:hidden">{user.email}</p>
                </div>

                {/* Email */}
                <p className="text-sm text-gray-500 truncate hidden md:block">{user.email}</p>

                {/* Role */}
                <div className="hidden md:block">
                  <UserRoleBadge role={user.role} />
                </div>

                {/* Status */}
                <div className="hidden md:block">
                  <UserStatusBadge status={status} />
                </div>

                {/* Date */}
                <p className="text-xs text-gray-400 hidden md:block whitespace-nowrap">
                  {formatDate(user.createdAt)}
                </p>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => navigate(`/dashboard/users/${user.id}`)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                    title="Ver detalle"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  {isAdmin && (
                    <>
                      <button
                        onClick={() => openEditModal(user.id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                        title="Editar"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => openRoleModal(user.id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-violet-600 hover:bg-violet-50 transition-colors"
                        title="Cambiar rol"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => openDeleteModal(user.id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Eliminar"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100 bg-gray-50/40">
          <button
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            ← Anterior
          </button>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
              .reduce<(number | '...')[]>((acc, p, idx, arr) => {
                if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push('...');
                acc.push(p);
                return acc;
              }, [])
              .map((p, idx) =>
                p === '...' ? (
                  <span key={`dot-${idx}`} className="px-1 text-gray-300 text-sm">…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => onPageChange(p as number)}
                    className={`h-7 w-7 rounded-lg text-xs font-medium transition-colors ${
                      p === page
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    {p}
                  </button>
                )
              )}
          </div>
          <button
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Siguiente →
          </button>
        </div>
      )}
    </div>
  );
}
