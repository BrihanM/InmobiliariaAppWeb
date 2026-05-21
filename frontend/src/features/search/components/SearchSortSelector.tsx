import { SORT_OPTIONS } from '../types';
import type { SortOption } from '../types';

interface SearchSortSelectorProps {
  value: SortOption;
  onChange: (sort: SortOption) => void;
}

export function SearchSortSelector({ value, onChange }: SearchSortSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-slate-500 hidden sm:inline whitespace-nowrap">Ordenar por:</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
        className="text-sm border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-slate-700 cursor-pointer"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
