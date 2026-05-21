import { SearchSortSelector } from './SearchSortSelector';
import type { SortOption } from '../types';

interface SearchResultsHeaderProps {
  total: number | undefined;
  isLoading: boolean;
  isFetching: boolean;
  sort: SortOption;
  view: 'grid' | 'list';
  query: string;
  onSortChange: (sort: SortOption) => void;
  onViewChange: (view: 'grid' | 'list') => void;
}

export function SearchResultsHeader({
  total,
  isLoading,
  isFetching,
  sort,
  view,
  query,
  onSortChange,
  onViewChange,
}: SearchResultsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
      {/* Result count */}
      <div className="flex items-center gap-2">
        {isLoading ? (
          <div className="h-5 w-36 bg-slate-200 rounded-full animate-pulse" />
        ) : (
          <p className="text-slate-600 text-sm">
            <span className="font-bold text-slate-800">{total ?? 0}</span>{' '}
            {(total ?? 0) === 1 ? 'resultado' : 'resultados'}
            {query && (
              <>
                {' '}para{' '}
                <span className="text-indigo-600 font-semibold">"{query}"</span>
              </>
            )}
          </p>
        )}
        {isFetching && !isLoading && (
          <svg
            className="w-4 h-4 animate-spin text-indigo-400"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <SearchSortSelector value={sort} onChange={onSortChange} />

        {/* View toggle */}
        <div className="flex bg-white border border-slate-200 rounded-xl overflow-hidden">
          <button
            onClick={() => onViewChange('grid')}
            title="Vista cuadrícula"
            aria-pressed={view === 'grid'}
            className={`px-3 py-2.5 transition-colors ${
              view === 'grid' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              />
            </svg>
          </button>
          <button
            onClick={() => onViewChange('list')}
            title="Vista lista"
            aria-pressed={view === 'list'}
            className={`px-3 py-2.5 transition-colors ${
              view === 'list' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 10h16M4 14h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
