import { useState, useEffect } from 'react';
import { useDebounce } from '@/shared/hooks/useDebounce';
import type { UserFilters, UserRole } from '../types';
import { ALL_ROLES, ROLE_LABELS } from '../utils/userHelpers';

interface UserFiltersProps {
  filters: UserFilters;
  onChange: (filters: UserFilters) => void;
  onReset: () => void;
}

export function UserFiltersBar({ filters, onChange, onReset }: UserFiltersProps) {
  const [search, setSearch] = useState(filters.email ?? '');
  const [name, setName] = useState(filters.firstName ?? '');
  const debouncedSearch = useDebounce(search, 400);
  const debouncedName = useDebounce(name, 400);

  useEffect(() => {
    onChange({ ...filters, email: debouncedSearch || undefined, page: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  useEffect(() => {
    onChange({ ...filters, firstName: debouncedName || undefined, page: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedName]);

  const hasActive =
    !!filters.email || !!filters.firstName || !!filters.role;

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Search by email */}
      <div className="relative flex-1 min-w-48">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por email..."
          className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-colors"
        />
      </div>

      {/* Search by name */}
      <div className="relative flex-1 min-w-40">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">👤</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Buscar por nombre..."
          className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-colors"
        />
      </div>

      {/* Role filter */}
      <select
        value={filters.role ?? ''}
        onChange={(e) =>
          onChange({ ...filters, role: (e.target.value as UserRole | '') || undefined, page: 1 })
        }
        className="py-2 px-3 text-sm border border-gray-200 rounded-xl outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 bg-white transition-colors"
      >
        <option value="">Todos los roles</option>
        {ALL_ROLES.map((r) => (
          <option key={r} value={r}>
            {ROLE_LABELS[r]}
          </option>
        ))}
      </select>

      {/* Reset */}
      {hasActive && (
        <button
          onClick={() => {
            setSearch('');
            setName('');
            onReset();
          }}
          className="text-sm text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1"
        >
          ✕ Limpiar
        </button>
      )}
    </div>
  );
}
